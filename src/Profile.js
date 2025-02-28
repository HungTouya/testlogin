import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

function Profile() {
    const [userData, setUserData] = useState(null);
    
    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                const docRef = doc(db, "customersData", auth.currentUser.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    console.error("User data not found");
                }
            }
        };
        fetchUserData();
    }, []);

    if (!userData) {
        return <p>Loading profile...</p>;
    }

    return (
        <div>
            <h2>Profile</h2>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone:</strong> {userData.phone}</p>
            <p><strong>Diabetes Type:</strong> {userData.diabetesType || "Not specified"}</p>
        </div>
    );
}

export default Profile;

