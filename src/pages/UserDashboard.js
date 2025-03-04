import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Menu from "./Menu";
import Schedule from "./Schedule";
import Profile from "./Profile";
import RecipePage from "./RecipePage"; // ✅ Ensure correct import
import Navbar from "../comp/Navbar"; // ✅ Now using the separate Navbar component
import "../css/UserDashboard.css";

function UserDashboard() {
    return (
        <div className="user-dashboard">
            {/* Navbar at the top */}
            <Navbar />

            {/* Routes for user pages */}
            <Routes>
                <Route path="home" element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="profile" element={<Profile />} />
                <Route path="menu/recipes/:id" element={<RecipePage />} /> {/* ✅ Correct path */}
            </Routes>
        </div>
    );
}

export default UserDashboard;






