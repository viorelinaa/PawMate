import { Routes, Route } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Home from "../pages/Home";
import Adoption from "../pages/Adoption";
import LostPets from "../pages/LostPets";
import Donations from "../pages/Donations";
import Quiz from "../pages/Quiz";
import SittersList from "../pages/SittersList";
import Login from "../pages/Login";
import Signup from "../pages/SignUp";
export default function AppRoutes() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/adoptie" element={<Adoption />} />
                <Route path="/pierdute" element={<LostPets />} />
                <Route path="/donatii" element={<Donations />} />
                <Route path="/sitters" element={<SittersList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </>
    );
}
