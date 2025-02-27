import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Profile from "./Profile";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <Router>
            <div className="App">
                <nav>
                    <h2>Cooking App</h2>
                    {user ? (
                        <>
                            <p>Welcome, {user.email}</p>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <p>Please login or register.</p>
                    )}
                </nav>

                <Routes>
                    <Route path="/" element={user ? <Profile /> : <Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={user ? <Profile /> : <Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

