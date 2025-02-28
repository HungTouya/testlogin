import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Profile from "./Profile";
import AdminDashboard from "./AdminDashboard";
import PrivateRoute from "./PrivateRoute"; // ✅ Import PrivateRoute

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                
                {/* ✅ Protected Routes */}
                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
