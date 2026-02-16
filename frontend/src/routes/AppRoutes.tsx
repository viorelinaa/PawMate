import { Routes, Route } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import Home from "../pages/Home";
import Adoption from "../pages/Adoption";
import LostPets from "../pages/LostPets";
import Donations from "../pages/Donations";
import Quiz from "../pages/Quiz";
import SittersList from "../pages/SittersList";
import Login from "../pages/Login";
import Signup from "../pages/SignUp";
import { paths } from "./paths";
import NotFound from "../pages/NotFound";
import Veterinari from "../pages/Veterinari";
export default function AppRoutes() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path={paths.home} element={<Home />} />
                <Route path= {paths.sitters} element={<SittersList />} />
                <Route path={paths.login} element={<Login />} />
                <Route path={paths.signup} element={<Signup />} />
            </Routes>
            <main style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/adoptie" element={<Adoption />} />
                    <Route path="/pierdute" element={<LostPets />} />
                    <Route path="/veterinari" element={<Veterinari />} />
                    <Route path="/donatii" element={<Donations />} />
                    <Route path="/sitters" element={<SittersList />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}
