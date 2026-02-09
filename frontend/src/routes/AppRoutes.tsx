import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import SittersList from "../pages/SittersList";
import Login from "../pages/Login";
import Signup from "../pages/SignUp";
export default function AppRoutes() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sitters" element={<SittersList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </>
    );
}
