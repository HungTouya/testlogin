import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import AdminDashboard from "../pages/AdminDashboard";
import PrivateRoute from "./PrivateRoute"; 
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                
                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
