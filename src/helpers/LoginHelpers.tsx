import axios from "axios";
import Cookies from "js-cookie";

export const getUserId = (): number | undefined => {
    let userId = Cookies.get("UserId");
    if (userId !== undefined) return parseInt(userId);
    return userId;
};

export const isLoggedIn = (): boolean => {
    const userId = Cookies.get("UserId");
    return userId !== undefined && userId !== null;
};

export const getLoggedInUser = async () => {
    if (!isLoggedIn()) return undefined;
    const userId = parseInt((Cookies.get("UserId") as string) || "") || undefined;

    const config = {
        headers: {
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };

    const response = await axios.get(`http://localhost:4941/api/v1/users/${userId}`, config);
    return response;
};

export const uploadProfilePhoto = async (image: any) => {
    if (!isLoggedIn()) return;

    const userId = parseInt((Cookies.get("UserId") as string) || "") || undefined;
    let imageType = image.type;
    if (imageType === "image/jpg") imageType = "image/jpeg";

    const config = {
        headers: {
            "content-type": imageType,
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };

    return await axios
        .put(`http://localhost:4941/api/v1/users/${userId}/image`, image, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            return error.response.status;
        });
};

export const deleteProfilePhoto = async () => {
    if (!isLoggedIn()) return;
    const userId = parseInt((Cookies.get("UserId") as string) || "") || undefined;

    const config = {
        headers: {
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };

    return await axios
        .delete(`http://localhost:4941/api/v1/users/${userId}/image`, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            return error.response.status;
        });
};

export const getProfilePhoto = () => {
    if (!isLoggedIn()) return "";
    const userId = parseInt((Cookies.get("UserId") as string) || "") || undefined;

    return `http://localhost:4941/api/v1/users/${userId}/image`;
};

export const getProfilePhotoFor = (id: number) => {
    return `http://localhost:4941/api/v1/users/${id}/image`;
};

export const logout = async () => {
    const config = {
        headers: {
            "content-type": "application/json",
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };

    return await axios
        .post(`http://localhost:4941/api/v1/users/logout`, {}, config)
        .then((response) => {
            Cookies.remove("UserId");
            Cookies.remove("UserToken");
            return response.status;
        })
        .catch((error) => {
            console.log(error);
            return error.response.status;
        });
};

export const register = async (firstName: string, lastName: string, email: string, password: string) => {
    return await axios
        .post(`http://localhost:4941/api/v1/users/register`, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        })
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            console.log(error);
            return -1;
        });
};

export const updateUser = async (
    firstName: string,
    lastName: string,
    email: string,
    password?: string,
    currentPassword?: string
) => {
    if (!isLoggedIn()) return undefined;
    const userId = parseInt((Cookies.get("UserId") as string) || "") || undefined;

    let body;
    if (password !== undefined && password.length > 0) {
        body = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            currentPassword: currentPassword,
        };
    } else {
        body = {
            firstName: firstName,
            lastName: lastName,
            email: email,
        };
    }

    console.log(body);
    const config = {
        headers: {
            "X-Authorization": Cookies.get("UserToken") || "",
        },
    };

    return await axios
        .patch(`http://localhost:4941/api/v1/users/${userId}`, body, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            console.log(error);
            return error.response.status;
        });
};

export const login = async (email: string, password: string) => {
    return await axios
        .post(`http://localhost:4941/api/v1/users/login`, {
            email: email,
            password: password,
        })
        .then((response) => {
            Cookies.set("UserId", response.data.userId);
            Cookies.set("UserToken", response.data.token);
            return response.status;
        })
        .catch((error) => {
            console.log(error);
            return error.response.status;
        });
};
