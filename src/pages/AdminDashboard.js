import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

            <div className="flex justify-center space-x-4 mb-6">
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => navigate("/admin-dashboard/add-recipe")}
                >
                    Add Recipe
                </button>
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => navigate("/admin-dashboard/add-schedule")}
                >
                    Add Schedule
                </button>
            </div>

            <p className="text-center">Welcome, Admin! Manage recipes and schedules here.</p>

            <div className="text-center mt-6">
                <button 
                    onClick={handleLogout} 
                    className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default AdminDashboard;





