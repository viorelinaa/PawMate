import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
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
