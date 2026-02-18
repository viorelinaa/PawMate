import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./layouts/Navbar";
import { AuthProvider } from "./context/AuthContext";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <ScrollToTop />
                <Navbar />
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}
