import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../style/Navigation.css";

export const NavigationPane = () => {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);

    return (
        <div>
            <nav className="navbar">
                <div className="nav-container">
                    <NavLink to="/" className="nav-logo">
                        Seng365
                        <i className="fas fa-code"></i>
                    </NavLink>

                    <ul className={click ? "nav-menu active" : "nav-menu"}>
                        <li className="nav-item">
                            <NavLink to="/auctions" className="nav-links" onClick={handleClick}>
                                Auctions
                            </NavLink>
                        </li>
                        {/*Only display register when user logged*/}
                        <li className="nav-item">
                            <NavLink to="/profile" className="nav-links" onClick={handleClick}>
                                Profile
                            </NavLink>
                        </li>
                        {/*Only display register when user not logged in*/}
                        <li className="nav-item">
                            <NavLink to="/register" className="nav-links" onClick={handleClick}>
                                Register
                            </NavLink>
                        </li>
                        {/*Only display register when user not logged in*/}
                        <li className="nav-item">
                            <NavLink to="/login" className="nav-links" onClick={handleClick}>
                                Login
                            </NavLink>
                        </li>
                    </ul>
                    <div className="nav-icon" onClick={handleClick}>
                        <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
                    </div>
                </div>
            </nav>
        </div>
    );
};
