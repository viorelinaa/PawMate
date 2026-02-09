import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Adoption from "../pages/Adoption";
import SittersList from "../pages/SittersList";
import Login from "../pages/Login";

export default function AppRoutes() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/adoptie" element={<Adoption />} />
                <Route path="/sitters" element={<SittersList />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    );
}
