import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./layouts/Navbar";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Navbar />
            <AppRoutes />
        </BrowserRouter>
    );
}
