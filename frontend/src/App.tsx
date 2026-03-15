import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./layouts/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { ApiProvider } from "./axios/ApiProvider";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
    if (typeof window === "undefined") return "light";

    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function AppShell({
    theme,
    onToggleTheme,
}: {
    theme: Theme;
    onToggleTheme: () => void;
}) {
    return (
        <div className="appShell" data-theme={theme}>
            <ScrollToTop />
            <Navbar theme={theme} onToggleTheme={onToggleTheme} />
            <AppRoutes />
        </div>
    );
}

export default function App() {
    const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <AuthProvider>
            <BrowserRouter>
                <ApiProvider>
                    <AppShell
                        theme={theme}
                        onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
                    />
                </ApiProvider>
            </BrowserRouter>
        </AuthProvider>
    );
}
