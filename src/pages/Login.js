import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "../css/style.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user) {
                setError("Login failed. Please try again.");
                return;
            }

            const userDocRef = doc(db, "customersData", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const role = userData.role || "user"; 
                console.log("User Role:", role);

                if (role === "admin") {
                    navigate("/admin-dashboard"); 
                } else {
                    navigate("/user-dashboard/home"); 
                }
            } else {
                setError("User data not found in database.");
            }
        } catch (err) {
            setError("Incorrect email or password.");
            console.error("Login Error:", err);
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email" 
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required 
                />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
            <Link to="/register">Create new account</Link>
        </div>
    );
}

export default Login;

