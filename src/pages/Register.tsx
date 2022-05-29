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
import { IconButton, Stack, InputLabel, InputAdornment, Input as MuiInput } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import axios from "axios";
import { login, uploadProfilePhoto, register } from "../helpers/LoginHelpers";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Cookies from "js-cookie";

const theme = createTheme();
const Input = styled("input")({
    display: "none",
});
const acceptedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

export default function SignUp() {
    const [infoHelperText, setInfoHelperText] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [imageSrc, setImageSrc] = useState(
        "https://isobarscience.com/wp-content/uploads/2020/09/default-profile-picture1.jpg"
    );
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState(false);
    const [emailHelper, setEmailHelper] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordHelper, setPasswordHelper] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [otherErrorFlag, setOtherErrorFlag] = useState(false);
    const [otherError, setOtherError] = useState("");

    const handleSubmit = async () => {
        if (email && password && firstName && lastName && !emailError && !passwordError) {
            const registerResponse = await register(firstName, lastName, email, password);

            if (registerResponse === -1) {
                setEmailError(true);
                setEmailHelper("Email already taken");
                return;
            }

            const loginResponse = await login(email, password);

            if (loginResponse !== 200) {
                setOtherErrorFlag(true);
                setOtherError("Could not login");
                return;
            }

            if (profilePhoto !== null) {
                const uploadImageResponse = await uploadProfilePhoto(profilePhoto);
                if (uploadImageResponse !== 200 && uploadImageResponse !== 201) {
                    setOtherErrorFlag(true);
                    setOtherError("Error when uploading photo.");
                }
            }

            window.open(`/auctions`, "_self");
        } else {
            setOtherErrorFlag(true);
            setOtherError("Please double check all fields.");
        }
    };

    const changeProfile = async (e: any) => {
        console.log(e.target.files);
        const file = e.target.files[0];
        setProfilePhoto(file);
        console.log(file);
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

        if (password === "") {
            setPasswordHelper("Please enter a password.");
            setPasswordError(true);
        } else if (password.length < 6) {
            setPasswordHelper("Password must contain atleast 6 chars.");
            setPasswordError(true);
        } else {
            setPasswordHelper("");
            setPasswordError(false);
        }
    };

    useEffect(() => {
        validateInfo();
    }, [email, password, firstName, lastName]);

    return (
        <ThemeProvider theme={theme}>
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
                        Sign Up Form
                    </Typography>
                    <Typography color="red" variant="h5">
                        {otherError}
                    </Typography>
                    <Avatar src={imageSrc} sx={{ width: 150, height: 150, margin: 2 }} />
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
                    </Stack>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    onChange={(event) => setFirstName(event.target.value)}
                                    helperText={infoHelperText.firstName}
                                    error={firstName === ""}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    onChange={(event) => setLastName(event.target.value)}
                                    helperText={infoHelperText.lastName}
                                    error={lastName === ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={(event) => setEmail(event.target.value)}
                                    helperText={emailHelper}
                                    error={emailError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
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
                            // type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, fontFamily: "Oxygen" }}
                            onClick={handleSubmit}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link
                                    sx={{ fontFamily: "Oxygen" }}
                                    component={RouterLink}
                                    to={`/login`}
                                    variant="body2"
                                >
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
