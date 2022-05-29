import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auctions } from "./pages/Auctions";
import { NavigationPane } from "./components/Navigation";
import { SingleAuction } from "./pages/SingleAuction";

function App() {
    return (
        <div className="App">
            <Router>
                <NavigationPane />
                <Routes>
                    <Route path="/auctions" element={<Auctions />} />
                    <Route path="/auctions/:id" element={<SingleAuction />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
