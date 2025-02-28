import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Menu from "./Menu";
import Profile from "./Profile";
import RecipePage from "./RecipePage"; // ✅ Ensure correct import
import { auth } from "./firebase";
import "./UserDashboard.css";

function UserDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut();
        navigate("/login"); // Redirect to login page after logout
    };

    return (
        <div className="user-dashboard">
            {/* Toolbar for navigation */}
            <div className="toolbar">
                <Link to="/user-dashboard/menu">Menu</Link>
                <Link to="/user-dashboard/profile">Profile</Link>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>

            {/* Routes for user pages */}
            <Routes>
                <Route path="menu" element={<Menu />} />
                <Route path="profile" element={<Profile />} />
                <Route path="menu/recipes/:id" element={<RecipePage />} /> {/* ✅ Correct path */}
            </Routes>
        </div>
    );
}

export default UserDashboard;



