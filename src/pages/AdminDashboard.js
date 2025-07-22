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
        <div className="min-h-screen bg-[#FFF5F0] p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-[#6F4F37]">
                Admin Dashboard
            </h1>

            <div className="flex justify-center space-x-4 mb-6">
                <button 
                    className="bg-[#FFA07A] text-white px-4 py-2 rounded hover:bg-[#ff8c66] transition-colors"
                    onClick={() => navigate("/admin-dashboard/add-recipe")}
                >
                    Add Recipe
                </button>
                <button 
                    className="bg-[#FFA07A] text-white px-4 py-2 rounded hover:bg-[#ff8c66] transition-colors"
                    onClick={() => navigate("/admin-dashboard/add-schedule")}
                >
                    Add Schedule
                </button>
            </div>

            <p className="text-center text-[#6F4F37] font-medium">
                Welcome, Admin! Manage recipes and schedules here.
            </p>

            <div className="text-center mt-6">
                <button 
                    onClick={handleLogout} 
                    className="bg-[#6F4F37] text-white px-6 py-2 rounded hover:bg-[#5c3f2e] transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default AdminDashboard;





