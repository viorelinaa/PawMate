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
        </>
    );
}
