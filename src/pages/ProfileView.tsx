import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import { IconButton, Stack, InputLabel, InputAdornment, Input as MuiInput, Paper } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import axios from "axios";
import {
    logout,
    isLoggedIn,
    getProfilePhoto,
    getLoggedInUser,
    updateUser,
    deleteProfilePhoto,
    uploadProfilePhoto,
} from "../helpers/LoginHelpers";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Cookies from "js-cookie";
import { User } from "../types/userTypes.d";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const acceptedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
const theme = createTheme();
const Input = styled("input")({
    display: "none",
});

const centerCSS = {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
};

export const Profile = () => {
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [imageSrc, setImageSrc] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState(false);
    const [emailHelper, setEmailHelper] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordHelper, setPasswordHelper] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [newPasswordHelper, setNewPasswordHelper] = useState("");
    const [showNewPassword, setNewShowPassword] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [otherErrorFlag, setOtherErrorFlag] = useState(false);
    const [otherError, setOtherError] = useState("");
    const [userInfo, setUserInfo] = useState<User | undefined>(undefined);

    const getUserInfo = async () => {
        const response = await getLoggedInUser();
        if (response !== undefined) {
            setUserInfo(response.data);
            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
            setEmail(response.data.email);
            if (imageSrc === "") {
                setImageSrc(getProfilePhoto());
            }
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    const validateInfo = () => {
        if (email === "") {
            setEmailHelper("Please enter an email");
            setEmailError(true);
        } else if (email.indexOf("@") === -1) {
            setEmailHelper("Email does not contain an @ symbol");
            setEmailError(true);
        } else if (!/.+@.+\.[A-Za-z]+$/.test(email)) {
            setEmailHelper("Email is not formatted correctly");
            setEmailError(true);
        } else {
            setEmailHelper("");
            setEmailError(false);
        }

        if (newPassword.length > 0 && password.length < 6) {
            setPasswordHelper("Please enter your current password to change your password.");
            setPasswordError(true);
        } else {
            setPasswordHelper("");
            setPasswordError(false);
        }

        if (newPassword.length < 6 && newPassword.length > 0) {
            setNewPasswordHelper("Password must contain atleast 6 chars.");
            setNewPasswordError(true);
        } else {
            setNewPasswordHelper("");
            setNewPasswordError(false);
        }
    };

    const removeProfileImage = () => {
        setImageSrc("none");
        setProfilePhoto(null);
    };

    const changeProfile = async (e: any) => {
        const file = e.target.files[0];
        setProfilePhoto(file);
        if (file === undefined) {
            setImageSrc("");
            return;
        }
        if (!acceptedTypes.includes(file.type)) {
            setImageSrc("");
            return;
        }

        const src = URL.createObjectURL(file);
        setImageSrc(src);
    };

    useEffect(() => {
        validateInfo();
    }, [email, password, firstName, lastName, newPassword]);

    const handleUpdateUser = async () => {
        let updateResponse;
        if (password.length > 0 && newPassword.length > 0) {
            updateResponse = await updateUser(firstName, lastName, email, newPassword, password);
        } else {
            updateResponse = await updateUser(firstName, lastName, email, undefined, password);
        }

        if (updateResponse === 400) {
            setOtherError("Incorrect password");
            setOtherErrorFlag(true);
            return;
        }
        if (updateResponse === 500) {
            setOtherError("Email is already taken");
            setOtherErrorFlag(true);
            return;
        }
        if (updateResponse !== 200) {
            setOtherError("Something went wrong.");
            setOtherErrorFlag(true);
            return;
        }

        if (profilePhoto !== null && profilePhoto !== undefined && imageSrc !== "none") {
            const uploadImageResponse = await uploadProfilePhoto(profilePhoto);
            if (uploadImageResponse !== 200 && uploadImageResponse !== 201) {
                setOtherError("Something went wrong.");
                setOtherErrorFlag(true);
            }
        } else {
            const uploadImageResponse = await deleteProfilePhoto();
            if (uploadImageResponse !== 200 && uploadImageResponse !== 201) {
                setOtherError("Something went wrong.");
                setOtherErrorFlag(true);
            }
        }

        window.open(`/profile`, "_self");
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid
                container
                style={{ padding: "16px", height: "100%" }}
                xs={12}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Grid xs={10} sm={8} md={6} style={centerCSS} mt="10vh">
                    <Paper style={{ width: "100%", maxWidth: "400px", padding: "16px" }}>
                        <Grid container xs={12} spacing={2}>
                            <Grid item xs={12} style={centerCSS}>
                                <Avatar
                                    style={{ height: "120px", width: "120px" }}
                                    alt={userInfo?.firstName}
                                    src={getProfilePhoto()}
                                />
                            </Grid>
                            <Grid item xs={12} style={centerCSS}>
                                <Typography variant="h4">{userInfo?.firstName + " " + userInfo?.lastName}</Typography>
                            </Grid>
                            <Grid item xs={12} style={centerCSS}>
                                <Typography variant="h6" color="GrayText">
                                    {userInfo?.email}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h4" sx={{ fontFamily: "Oxygen" }}>
                        Edit User Details
                    </Typography>
                    <Typography color="red" variant="h5">
                        {otherError}
                    </Typography>
                    <Avatar alt={userInfo?.firstName} src={imageSrc} sx={{ width: 150, height: 150, margin: 2 }} />
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <label htmlFor="contained-button-file">
                            <Input
                                accept=".jpg,.jpeg,.png,.gif"
                                id="contained-button-file"
                                type="file"
                                onChange={async (e) => await changeProfile(e)}
                            />
                            <Button
                                sx={{ fontFamily: "Oxygen" }}
                                variant="contained"
                                component="span"
                                endIcon={<PhotoCamera />}
                            >
                                Upload
                            </Button>
                        </label>
                        <Button
                            sx={{ fontFamily: "Oxygen", marginLeft: 2, color: "white", bgcolor: "red" }}
                            variant="outlined"
                            component="span"
                            endIcon={<DeleteForeverIcon />}
                            color="error"
                            onClick={removeProfileImage}
                        >
                            Delete
                        </Button>
                    </Stack>
                    <Box component="form" noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    onChange={(event) => setFirstName(event.target.value)}
                                    error={firstName === ""}
                                    defaultValue={firstName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    onChange={(event) => setLastName(event.target.value)}
                                    error={lastName === ""}
                                    defaultValue={lastName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={(event) => setEmail(event.target.value)}
                                    helperText={emailHelper}
                                    error={emailError}
                                    defaultValue={email}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="password"
                                    label="New Password"
                                    type={showNewPassword ? "text" : "password"}
                                    id="new-password"
                                    autoComplete="new-password"
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    helperText={newPasswordHelper}
                                    error={newPasswordError}
                                    InputProps={{
                                        // <-- This is where the toggle button is added.
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => {
                                                        setNewShowPassword(!showNewPassword);
                                                    }}
                                                    onMouseDown={() => {
                                                        setNewShowPassword(!showNewPassword);
                                                    }}
                                                >
                                                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={(event) => setPassword(event.target.value)}
                                    helperText={passwordHelper}
                                    error={passwordError}
                                    InputProps={{
                                        // <-- This is where the toggle button is added.
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => {
                                                        setShowPassword(!showPassword);
                                                    }}
                                                    onMouseDown={() => {
                                                        setShowPassword(!showPassword);
                                                    }}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, fontFamily: "Oxygen" }}
                            onClick={handleUpdateUser}
                        >
                            Change Details
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};
