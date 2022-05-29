import { useState, useEffect } from "react";
import { AuctionOut } from "../types/auctionTypes";
import axios from "axios";
import "../style/AuctionCards.css";
import "../style/Auctions.css";
import {
    Box,
    TextField,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    CardActionArea,
    CardActions,
    OutlinedInput,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    SelectChangeEvent,
    Chip,
    ButtonGroup,
    Pagination,
    Stack,
    Link,
} from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { SingleAuction } from "./SingleAuction";
import { Link as RouterLink } from "react-router-dom";
import { CreateAuction } from "../components/AuctionCreate";
import { getUserId } from "../helpers/LoginHelpers";

function getStyles(name: string, selectCategories: readonly string[], theme: Theme) {
    return {
        fontWeight:
            selectCategories.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export const Auctions = () => {
    const [auctionList, setAuctionList] = useState<AuctionOut[] | []>([]);
    const [count, setCount] = useState(0);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [categories, setCategories] = useState([]);

    // Filtering paramters
    const [searchQ, setSearchQ] = useState("");

    const theme = useTheme();
    const [selectCategories, setSelectCategories] = useState<string[]>([]);
    const handleCategorySelector = (event: SelectChangeEvent<typeof selectCategories>) => {
        const {
            target: { value },
        } = event;
        setSelectCategories(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    const [status, setStatus] = useState("ANY");

    const [sort, setSort] = useState("CLOSING_SOON");
    const handleSortChange = (event: SelectChangeEvent) => {
        setSort(event.target.value);
    };

    const [pageStart, setPageStart] = useState(0);

    const retrieveAuctions = () => {
        const filtering = {
            startIndex: pageStart,
            count: pageStart + 10,
            sortBy: sort,
            q: searchQ,
            categoryIds: categories
                .filter((item: any) => selectCategories.includes(item.name))
                .map((item: any) => {
                    return item.categoryId;
                }),
            status: status,
        };
        axios.get(`http://localhost:4941/api/v1/auctions`, { params: filtering }).then(
            (response) => {
                setAuctionList(response.data.auctions);
                setErrorFlag(false);
                setErrorMessage("");
                setCount(response.data.count);
            },
            (error) => {
                setAuctionList([]);
                setErrorFlag(true);
                setErrorMessage(error);
                setCount(0);
            }
        );
    };

    const getCategories = () => {
        axios.get("http://localhost:4941/api/v1/auctions/categories").then(
            (res) => {
                setCategories(res.data);
                setErrorFlag(false);
                setErrorMessage("");
            },
            (error) => {
                setCategories([]);
                setErrorFlag(true);
                setErrorMessage(error);
                setCount(0);
            }
        );
    };

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        retrieveAuctions();
    }, [searchQ, selectCategories, status, sort, pageStart]);

    const getRemainingTime = (date: any) => {
        let closingDate = new Date(date);
        let now = new Date();
        return Math.round(Math.round(closingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    };

    // Creating a card of the auctions
    const listOfAuctions = () => {
        return auctionList.map((item: AuctionOut) => {
            return (
                <Card sx={{ maxWidth: 350 }} className="auctions_card_body" key={item.auctionId}>
                    <CardActionArea component={RouterLink} to={`/auctions/${item.auctionId}`}>
                        <CardMedia
                            component="img"
                            height="150"
                            image={`http://localhost:4941/api/v1/auctions/${item.auctionId}/image`}
                            alt="auction bid"
                            onError={(ev: any) =>
                                (ev.target.src =
                                    "https://w7.pngwing.com/pngs/838/205/png-transparent-auction-gavel-icon-auction-angle-internet-hammer.png")
                            }
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                align="center"
                                className="auctions_card_title"
                            >
                                {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {getRemainingTime(item.endDate) < 1
                                    ? "Auction Closed"
                                    : `Ending in ${getRemainingTime(item.endDate)} days.`}{" "}
                                <br></br>
                                Category:{" "}
                                {categories.filter((cat: any) => cat.categoryId === item.categoryId)[0]["name"]}
                                <br></br>
                                Num of Bids: {item.numBids} <br></br>
                                Highest Bid: {item.numBids === 0 ? "None" : "$" + item.highestBid} <br></br>
                                Reserve Price: ${item.reserve} {item.highestBid >= item.reserve ? "(Reached)" : ""}
                                <br></br>
                                <br></br>
                                Seller: {`${item.sellerFirstName} ${item.sellerLastName}`}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button
                            size="medium"
                            color="info"
                            variant="outlined"
                            fullWidth
                            component={RouterLink}
                            to={`/auctions/${item.auctionId}`}
                        >
                            View More Info
                        </Button>
                    </CardActions>
                </Card>
            );
        });
    };

    if (errorFlag) {
        return (
            <div>
                <h1>Auctions Page</h1>
                <h3 style={{ color: "red" }}>Getting auctions failed with error {errorMessage}</h3>
            </div>
        );
    } else {
        return (
            <div>
                <Box
                    id="filter_box"
                    component="form"
                    sx={{
                        "& .MuiTextField-root": { m: 1, width: 300 },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        id="outlined-search"
                        label="Search Auctions"
                        type="search"
                        onChange={(event: any) => {
                            setSearchQ(event.target.value);
                        }}
                        onKeyDown={(event: any) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                            }
                        }}
                    />
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="multiple-category-selector-label">Category Selector</InputLabel>
                        <Select
                            labelId="multiple-category-selector-label"
                            id="multi-category"
                            multiple
                            value={selectCategories}
                            onChange={handleCategorySelector}
                            input={<OutlinedInput id="select-multiple-chip" label="Category Selector" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 48 * 4.5 + 8,
                                        width: 250,
                                    },
                                },
                            }}
                        >
                            {categories
                                .map((cat: any) => {
                                    return cat.name;
                                })
                                .map((name) => (
                                    <MenuItem key={name} value={name} style={getStyles(name, selectCategories, theme)}>
                                        {name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <ButtonGroup sx={{ width: 300 }} size="large" aria-label="large button group">
                        <Button key="all" onClick={() => setStatus("ANY")}>
                            Show All
                        </Button>
                        <Button key="open" onClick={() => setStatus("OPEN")}>
                            Show Open
                        </Button>
                        <Button key="close" onClick={() => setStatus("CLOSED")}>
                            Show Closed
                        </Button>
                    </ButtonGroup>
                    <FormControl>
                        <InputLabel id="select-label">Sort By</InputLabel>
                        <Select
                            labelId="select-label"
                            id="simple-select"
                            value={sort}
                            label="Sort By"
                            onChange={handleSortChange}
                        >
                            <MenuItem value="CLOSING_SOON">Closing Soon</MenuItem>
                            <MenuItem value="CLOSING_LAST">Closing Last</MenuItem>
                            <MenuItem value="BIDS_DESC">Highest Bid</MenuItem>
                            <MenuItem value="BIDS_ASC">Lowest Bid</MenuItem>
                            <MenuItem value="RESERVE_DESC">Highest Reserve</MenuItem>
                            <MenuItem value="RESERVE_ASC">Lowest Reserve</MenuItem>
                            <MenuItem value="ALPHABETICAL_ASC">Alphabetical A-Z</MenuItem>
                            <MenuItem value="ALPHABETICAL_DESC">Alphabetical Z-A</MenuItem>
                        </Select>
                        <CreateAuction edit={false} id={getUserId()} />
                    </FormControl>

                    <p style={{ color: "gray" }}>
                        {count <= 1
                            ? count === 0
                                ? "No Auctions Found"
                                : `Retrieved ${count} auction.`
                            : `Retrieved ${count} auctions.`}
                    </p>
                </Box>
                <Stack spacing={5}>
                    <Pagination
                        count={Math.ceil(count / 10)}
                        color="secondary"
                        showFirstButton
                        showLastButton
                        onChange={(event: React.ChangeEvent<unknown>, page: number) => {
                            setPageStart(page * 10 - 10);
                        }}
                        sx={{ justifyContent: "center", display: "flex" }}
                    />
                </Stack>
                <div className="auctions_cards_wrapper">{listOfAuctions()}</div>
            </div>
        );
    }
};
