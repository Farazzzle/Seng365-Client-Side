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
import { getLoggedInUser, getUserId, isLoggedIn } from "../helpers/LoginHelpers";
import { fetchAuctions } from "../helpers/AuctionHelper";

const getRemainingTime = (date: any) => {
    let closingDate = new Date(date);
    let now = new Date();
    return Math.round(Math.round(closingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

export const MyAuctions = () => {
    const [auctions, setAuctions] = useState<AuctionOut[] | []>([]);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [categories, setCategories] = useState([]);

    const getAuction = async () => {
        const userId = await getUserId();

        if (!userId) return;

        let params = {
            bidderId: userId,
        };
        const bidResponse = await fetchAuctions(params);

        let params2 = {
            sellerId: userId,
        };
        const sellResponse = await fetchAuctions(params2);

        setAuctions(bidResponse.data.auctions.concat(sellResponse.data.auctions));
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
            }
        );
    };

    useEffect(() => {
        getAuction();
        getCategories();
    }, []);

    const listOfAuctions = () => {
        return auctions.map((item: AuctionOut) => {
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

    return <div className="auctions_cards_wrapper">{listOfAuctions()}</div>;
};
