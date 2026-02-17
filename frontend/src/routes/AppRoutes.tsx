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
                    <Route path={paths.notfound} element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}
