import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import SearchBar from "./Searchbar"; 

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut();
        navigate("/login");
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-[#FAECD2] shadow-md z-50 h-16 flex items-center">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center w-full px-6">
                <div className="flex items-center space-x-6">
                    <span className="text-2xl font-semibold text-[#4e342e]">DiabeticMealPlan</span>
                    <SearchBar className="hidden md:block" />
                </div>

                <div className="hidden md:flex">
                    <ul className="flex space-x-6 font-medium">
                        <li>
                            <Link to="/user-dashboard/home" className="text-[#4e342e] hover:text-[#1347A3]">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/user-dashboard/menu" className="text-[#4e342e] hover:text-[#1347A3]">
                                Menu
                            </Link>
                        </li>
                        <li>
                            <Link to="/user-dashboard/schedule" className="text-[#4e342e] hover:text-[#1347A3]">
                                Schedule
                            </Link>
                        </li>
                        <li>
                            <Link to="/user-dashboard/profile" className="text-[#4e342e] hover:text-[#1347A3]">
                                Profile
                            </Link>
                        </li>
                    </ul>
                </div>

                <button 
                    onClick={handleLogout} 
                    className="bg-[#FFA07A] text-white py-2 px-4 rounded-md hover:bg-[#6F4F37]"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;





