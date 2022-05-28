import { useState, useEffect } from "react";
import { AuctionOut } from "../types/auctionTypes.d";
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
} from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";

const convertDate = (date: string) => {
    let normalDate = new Date(date);
    return normalDate.toLocaleString("en-NZ");
};

export const Auctions = () => {
    const [auctionList, setAuctionList] = useState<AuctionOut[] | []>([]);
    const [count, setCount] = useState(0);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [categories, setCategories] = useState([]);

    // Filtering paramters
    const [searchQ, setSearchQ] = useState("");
    const [filterCategories, setFilterCategories] = useState([]);

    const retrieveAuctions = () => {
        const filtering = {
            // startIndex: (pageNumber - 1) * displayAmount,
            // count: displayAmount,
            // sortBy: convertToBackEndSort(sortByString),
            q: searchQ,
            // categoryIds: filterCategories,
            // status: statusString,
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
        axios.get("http://localhost:4941/api/v1/auctions/categories").then((res) => {
            setCategories(res.data);
            setErrorFlag(false);
            setErrorMessage("");
        });
    };

    useEffect(() => {
        retrieveAuctions();
    }, [searchQ]);

    useEffect(() => {
        getCategories();
    }, []);

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
                    <CardActionArea>
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
                        <Button size="medium" color="info" variant="outlined" fullWidth>
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
                    <p style={{ color: "gray" }}>
                        {count <= 1
                            ? count === 0
                                ? "No Auctions Found"
                                : `Retrieved ${count} auction.`
                            : `Retrieved ${count} auctions.`}
                    </p>
                </Box>

                <div className="auctions_cards_wrapper">{listOfAuctions()}</div>
            </div>
        );
    }
};
