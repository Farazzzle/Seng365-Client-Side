import axios from "axios";
import Cookies from "js-cookie";
import { isLoggedIn } from "./LoginHelpers";

export const postBid = async (auctionId: number, amount: number) => {
    if (!isLoggedIn()) return;

    const config = {
        headers: {
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };

    const response = await axios.post(
        `http://localhost:4941/api/v1/auctions/${auctionId}/bids`,
        {
            amount: amount,
        },
        config
    );
    return response;
};

export const fetchAuctions = async (config: any) => {
    const response = await axios.get(`http://localhost:4941/api/v1/auctions`, { params: config });
    return response;
};

export const postAuction = async (body: any) => {
    if (!isLoggedIn()) return;

    const config = {
        headers: {
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };

    const response = await axios.post(`http://localhost:4941/api/v1/auctions`, body, config).catch((error) => {
        return undefined;
    });
    return response;
};

export const patchAuction = async (body: any, auctionId: number) => {
    if (!isLoggedIn()) return;

    const config = {
        headers: {
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };

    const response = await axios
        .patch(`http://localhost:4941/api/v1/auctions/${auctionId}`, body, config)
        .catch((error) => {
            return undefined;
        });
    return response;
};

export const deleteAuction = async (auctionId: number) => {
    if (!isLoggedIn()) return;

    const config = {
        headers: {
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };

    const response = await axios.delete(`http://localhost:4941/api/v1/auctions/${auctionId}`, config);
    return response;
};

export const uploadPhoto = async (image: any, auctionId: number) => {
    if (!isLoggedIn()) return;

    let imageType = image.type;
    if (imageType === "image/jpg") imageType = "image/jpeg";

    const config = {
        headers: {
            "content-type": imageType,
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };

    return await axios
        .put(`http://localhost:4941/api/v1/auctions/${auctionId}/image`, image, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            return error.response.status;
        });
};

export const fetchCategories = async () => {
    const response = await axios.get(`http://localhost:4941/api/v1/auctions/categories`);
    if (response.status !== 200) return [];
    return response.data;
};
