import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../style/Navigation.css";
import Cookies from "js-cookie";
import { Button } from "@mui/material";
import { logout } from "../helpers/LoginHelpers";

export const NavigationPane = () => {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const handleLogout = async () => {
        await logout();
        window.open(`/auctions`, "_self");
    };

    const loggedInLinks = () => {
        if (Cookies.get("UserId") !== null && Cookies.get("UserId") !== undefined) {
            return (
                <div className="nav-container">
                    <li className="nav-item">
                        <NavLink to="/auctions" className="nav-links" onClick={handleClick}>
                            Auctions
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/profile" className="nav-links" onClick={handleClick}>
                            Profile
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={"/logout"} className="nav-links" onClick={handleLogout}>
                            Log Out
                        </NavLink>
                    </li>
                </div>
            );
        } else {
            return (
                <div className="nav-container">
                    <li className="nav-item">
                        <NavLink to="/auctions" className="nav-links" onClick={handleClick}>
                            Auctions
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/register" className="nav-links" onClick={handleClick}>
                            Register
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink to="/login" className="nav-links" onClick={handleClick}>
                            Login
                        </NavLink>
                    </li>
                </div>
            );
        }
    };

    return (
        <div>
            <nav className="navbar">
                <div className="nav-container">
                    <NavLink to="/auctions" className="nav-logo">
                        Seng365
                        <i className="fas fa-code"></i>
                    </NavLink>
                    <ul className={click ? "nav-menu active" : "nav-menu"}>{loggedInLinks()}</ul>
                    <div className="nav-icon" onClick={handleClick}>
                        <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
                    </div>
                </div>
            </nav>
        </div>
    );
};
