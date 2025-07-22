import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import AddRecipe from "./pages/AddRecipe";
import AddSchedule from "./pages/AddSchedule";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "customersData", currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role || "user");
        }
      } else {
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={user ? (role === "admin" ? <AdminDashboard /> : <UserDashboard />) : <Login />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/user-dashboard/*"
            element={user && role !== "admin" ? <UserDashboard /> : <Login />}
          />

          <Route
            path="/admin-dashboard"
            element={user && role === "admin" ? <AdminDashboard /> : <Login />}
          />
          <Route
            path="/admin-dashboard/add-recipe"
            element={user && role === "admin" ? <AddRecipe /> : <Login />}
          />
          <Route
            path="/admin-dashboard/add-schedule"
            element={user && role === "admin" ? <AddSchedule /> : <Login />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;





