import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import SearchBar from "./Searchbar"; // ✅ Import the SearchBar component

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut();
        navigate("/login");
    };

    return (
        <nav className="navbar fixed top-0 left-0 w-full bg-white shadow-md dark:bg-gray-900 z-50">
            <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
                {/* Logo + SearchBar Container */}
                <div className="flex items-center space-x-4">
                    <span className="text-2xl font-semibold text-gray-900 dark:text-white">LOGO</span>
                    <SearchBar /> {/* ✅ Search bar appears next to the logo */}
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex">
                    <ul className="flex space-x-8 font-medium">
                        <li>
                            <Link to="/user-dashboard/home" className="nav-link">Home</Link>
                        </li>
                        <li>
                            <Link to="/user-dashboard/menu" className="nav-link">Menu</Link>
                        </li>
                        <li>
                            <Link to="/user-dashboard/schedule" className="nav-link">Schedule</Link>
                        </li>
                        <li>
                            <Link to="/user-dashboard/profile" className="nav-link">Profile</Link>
                        </li>
                    </ul>
                </div>

                {/* Logout Button */}
                <div className="flex">
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;




