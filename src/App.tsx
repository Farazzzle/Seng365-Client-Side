import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auctions } from "./components/Auctions";
import { NavigationPane } from "./components/Navigation";

function App() {
    return (
        <div className="App">
            <Router>
                <NavigationPane />
                <Routes>
                    <Route path="/auctions" element={<Auctions />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
