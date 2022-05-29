import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auctions } from "./pages/Auctions";
import { NavigationPane } from "./components/Navigation";
import { SingleAuction } from "./pages/SingleAuction";
import SignUp from "./pages/Register";
import SignIn from "./pages/LogIn";

function App() {
    return (
        <div className="App">
            <Router>
                <NavigationPane />
                <Routes>
                    <Route path="/auctions" element={<Auctions />} />
                    <Route path="/auctions/:id" element={<SingleAuction />} />
                    <Route path="/register" element={<SignUp />} />
                    <Route path="/login" element={<SignIn />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
