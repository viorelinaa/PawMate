import { Routes, Route } from "react-router-dom";
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
import Voluntariat from "../pages/Voluntariat";
import Wiki from "../pages/Wiki";
import MedGuide from "../pages/MedGuide";
import Blog from "../pages/Blog";
import Vanzari from "../pages/Vanzari";
import Cart from "../pages/Cart";
import Evenimente from "../pages/Evenimente";
import Profile from "../pages/Profile";
import AdminDashboard from "../pages/AdminDashboard";
import AdminPages from "../pages/AdminPages";
import AdminUsers from "../pages/AdminUsers";
export default function AppRoutes() {
    return (
        <>
            <main style={{ flex: 1 }}>
                <Routes>
                    <Route path={paths.home} element={<Home />} />
                    <Route path={paths.adoptie} element={<Adoption />} />
                    <Route path={paths.pierdute} element={<LostPets />} />
                    <Route path={paths.veterinari} element={<Veterinari />} />
                    <Route path={paths.donatii} element={<Donations />} />
                    <Route path={paths.sitters} element={<SittersList />} />
                    <Route path={paths.ghidMedical} element={<MedGuide />} />
                    <Route path={paths.login} element={<Login />} />
                    <Route path={paths.quiz} element={<Quiz />} />
                    <Route path={paths.signup} element={<Signup />} />
                    <Route path={paths.voluntariat} element={<Voluntariat />} />
                    <Route path={paths.wiki} element={<Wiki />} />
                    <Route path={paths.blog} element={<Blog />} />
                    <Route path={paths.evenimente} element={<Evenimente />} />
                    <Route path={paths.vanzari} element={<Vanzari />} />
                    <Route path={paths.cos} element={<Cart />} />
                    <Route path={paths.profile} element={<Profile />} />
                    <Route path={paths.adminStatistici} element={<AdminDashboard />} />
                    <Route path={paths.adminPagini} element={<AdminPages />} />
                    <Route path={paths.adminUtilizatori} element={<AdminUsers />} />
                    <Route path={paths.notfound} element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}
