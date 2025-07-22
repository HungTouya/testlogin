import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import "./App.css";

function Toolbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="toolbar">
      <Link to="/menu">Menu</Link>
      <Link to="/profile">Profile</Link>
      <button onClick={handleLogout} className="logout-btn">Logout</button> 
    </div>
  );
}

export default Toolbar;
