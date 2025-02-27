import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!auth.currentUser) {
                navigate("/login"); // Redirect if not logged in
                return;
            }

            const userRef = doc(db, "customersData", auth.currentUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                setUserData(userSnap.data());
            } else {
                console.log("No such user data found!");
            }
            setLoading(false);
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = async () => {
        await auth.signOut();
        navigate("/login");
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            {userData ? (
                <div>
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Phone:</strong> {userData.phone}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Diabetes Type:</strong> {userData.diabetesType || "Not set"}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <p>User data not found.</p>
            )}
        </div>
    );
}

export default Profile;
