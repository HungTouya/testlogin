import React from "react"; 
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Menu from "./Menu";
import Schedule from "./Schedule";
import Profile from "./Profile";
import RecipePage from "./RecipePage";
import Navbar from "../comp/Navbar";
import "../css/UserDashboard.css";

function UserDashboard() {
    return (
        <div className="user-dashboard min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar />

            <div className="pt-20 max-w-screen-xl mx-auto px-6">
                <Routes>
                    <Route path="home" element={<Home />} />
                    <Route path="menu" element={<Menu />} />
                    <Route path="schedule" element={<Schedule />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="menu/recipes/:id" element={<RecipePage />} />
                </Routes>
            </div>
        </div>
    );
}

export default UserDashboard;









