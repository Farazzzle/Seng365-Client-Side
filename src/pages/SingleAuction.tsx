import * as React from "react";
import { AuctionOut } from "../types/auctionTypes";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    styled,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    Collapse,
    Avatar,
    Typography,
    Stack,
    List,
    ListItem,
    Divider,
    ListItemText,
    ListItemAvatar,
    Button,
    CardActionArea,
} from "@mui/material";
import { BidOut } from "../types/bidTypes.d";
import { Link as RouterLink } from "react-router-dom";
import "../style/AuctionCards.css";
import "../style/Auctions.css";

const convertDate = (date: string) => {
    let normalDate = new Date(date);
    return normalDate.toLocaleString("en-NZ");
};

export const SingleAuction = () => {
    const props = useParams();

    const [auctionInfo, setAuctionInfo] = useState<AuctionOut | undefined>(undefined);
    const [categoryName, setCategoryName] = useState<string>("");
    const [similarAuctions, setSimilarAuctions] = useState<AuctionOut[] | []>([]);
    const [bids, setBids] = useState<BidOut[] | []>([]);
    const [categories, setCategories] = useState([]);

    // const [userId, setUserId] = useState<number | undefined>(undefined)
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getAuctionInfo = () => {
        axios.get(`http://localhost:4941/api/v1/auctions/${props.id}`).then(
            (response) => {
                setAuctionInfo(response.data);
                setErrorFlag(false);
                setErrorMessage("");
            },
            (error) => {
                setAuctionInfo(undefined);
                setErrorFlag(true);
                setErrorMessage(error);
            }
        );
    };

    const getCatName = () => {
        axios.get("http://localhost:4941/api/v1/auctions/categories").then(
            (res) => {
                setCategories(res.data);
                const cat = res.data.filter((item: any) => item.categoryId === auctionInfo?.categoryId);
                if (cat) {
                    setCategoryName(cat[0].name);
                }
                setErrorFlag(false);
                setErrorMessage("");
            },
            (error) => {
                setCategories([]);
                setCategoryName("");
                setErrorFlag(true);
                setErrorMessage(error);
            }
        );
    };

    const getBids = () => {
        axios.get(`http://localhost:4941/api/v1/auctions/${auctionInfo?.auctionId}/bids`).then(
            (res) => {
                setBids(res.data);
                setErrorFlag(false);
                setErrorMessage("");
            },
            (error) => {
                setBids([]);
                setErrorFlag(true);
                setErrorMessage(error);
            }
        );
    };

    const getSimilarAuctions = () => {
        axios.get(`http://localhost:4941/api/v1/auctions`).then(
            (response) => {
                setSimilarAuctions(
                    response.data.auctions
                        .filter((item: AuctionOut) => {
                            return item.auctionId !== auctionInfo?.auctionId;
                        })
                        .filter((item: AuctionOut) => {
                            return (
                                item.categoryId === auctionInfo?.categoryId || item.sellerId === auctionInfo?.sellerId
                            );
                        })
                );
                setErrorFlag(false);
                setErrorMessage("");
            },
            (error) => {
                setSimilarAuctions([]);
                setErrorFlag(true);
                setErrorMessage(error);
            }
        );
    };

    const displayBids = () => {
        if (bids.length !== 0) {
            return bids.map((item: BidOut, index: number) => {
                return (
                    <ListItem alignItems="flex-start" key={item.bidderId + item.amount}>
                        <ListItemAvatar>
                            <Avatar
                                alt={item.firstName}
                                src={`http://localhost:4941/api/v1/users/${item.bidderId}/image`}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${item.firstName} ${item.lastName} - $${item.amount} ${
                                index === 0 ? "(Current Bid)" : ""
                            }`}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: "inline" }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {`$${convertDate(item.timestamp)}`}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                );
            });
        }
    };

    const listOfAuctions = () => {
        const getRemainingTime = (date: any) => {
            let closingDate = new Date(date);
            let now = new Date();
            return Math.round(Math.round(closingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        };
        return similarAuctions.map((item: AuctionOut) => {
            return (
                <div className="auctions_cards_wrapper" key={item.auctionId}>
                    <Card sx={{ maxWidth: 350 }} className="auctions_card_body" key={item.auctionId}>
                        <CardActionArea
                            component={RouterLink}
                            to={`/auctions/${item.auctionId}`}
                            onClick={() => {
                                window.open(`/auctions/${item.auctionId}`, "_self");
                            }}
                        >
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
                                onClick={() => {
                                    window.open(`/auctions/${item.auctionId}`, "_self");
                                }}
                            >
                                View More Info
                            </Button>
                        </CardActions>
                    </Card>
                </div>
            );
        });
    };

    useEffect(() => {
        getAuctionInfo();
    }, []);

    useEffect(() => {
        getCatName();
        getBids();
        getSimilarAuctions();
    }, [auctionInfo]);

    if (auctionInfo) {
        return (
            <div>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Card sx={{ display: "flex" }} className="single_auction_card">
                        <CardMedia
                            sx={{}}
                            component="img"
                            image={`http://localhost:4941/api/v1/auctions/${auctionInfo.auctionId}/image`}
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
                                {auctionInfo.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {auctionInfo.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Auction closing on {convertDate(auctionInfo.endDate)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Category: {categoryName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Reserve Price: ${auctionInfo.reserve}{" "}
                                {auctionInfo.numBids > 0 && auctionInfo.highestBid >= auctionInfo.reserve
                                    ? "(Reached)"
                                    : ""}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Card sx={{ display: "flex" }} className="single_auction_seller">
                            <Stack direction="row" spacing={2}>
                                <Avatar
                                    alt={`${auctionInfo.sellerFirstName}`}
                                    src={`http://localhost:4941/api/v1/users/${auctionInfo.sellerId}/image`}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {auctionInfo.sellerFirstName} {auctionInfo.sellerLastName}
                                </Typography>
                            </Stack>
                        </Card>
                        <Typography>{auctionInfo.numBids} Bids on Auction</Typography>
                        <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>{displayBids()}</List>
                    </Box>
                </Box>
                <Box sx={{ fontFamily: "Oxygen", padding: "1rem" }}>
                    <h5>Similar Auctions</h5>
                    <div className="auctions_cards_wrapper">{listOfAuctions()}</div>
                </Box>
            </div>
        );
    } else {
        return <h1></h1>;
    }
};