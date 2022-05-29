import axios from "axios";
import Cookies from "js-cookie";
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
import { useState, useEffect } from "react";
import { login } from "../helpers/LoginHelpers";

const theme = createTheme();

export default function SignIn() {
    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState(false);
    const [emailHelper, setEmailHelper] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordHelper, setPasswordHelper] = useState("");
    const [otherError, setOtherError] = useState("");

    const handleSubmit = async () => {
        if (passwordError || emailError) {
            setOtherError("Please ensure all fields are correctly provided");
        } else {
            setOtherError("");

            const response = await login(email, password);

            if (response !== 200) {
                setOtherError("Invalid Email/Password Combo");
                return;
            }

            if (!otherError) {
                window.open(`/auctions`, "_self");
            }
        }
    };

    const validate = () => {
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
        validate();
    }, [email, password]);

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
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Typography color="red">{otherError}</Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(event) => {
                                setEmail(event.target.value);
                            }}
                            error={emailError}
                            helperText={emailHelper}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(event) => {
                                setPassword(event.target.value);
                            }}
                            error={passwordError}
                            helperText={passwordHelper}
                        />
                        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                        <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleSubmit}>
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link
                                    variant="body2"
                                    sx={{ fontFamily: "Oxygen" }}
                                    component={RouterLink}
                                    to={`/register`}
                                >
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
