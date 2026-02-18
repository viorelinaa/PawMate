import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState(() => {
        if (typeof window === "undefined") return "light";
        const saved = window.localStorage.getItem("theme");
        if (saved === "light" || saved === "dark") return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    // când treci pe desktop, închide meniul (ca să nu rămână "open" din mobil)
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 768) setOpen(false);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        window.localStorage.setItem("theme", theme);
    }, [theme]);

    const isDark = theme === "dark";
    const toggleLabel = isDark ? "Activează modul luminos" : "Activează modul întunecat";

    return (
        <header className="navbar">
            <NavLink to="/" className="logo" end>
                🐾 PawMate
            </NavLink>

            <div className="navRight">
                {/* link-uri */}
                <nav className={`links ${open ? "open" : ""}`}>
                    <NavLink to="/" end onClick={() => setOpen(false)}>
                        Acasă
                    </NavLink>
                    <NavLink to="/quiz" onClick={() => setOpen(false)}>
                        Quiz
                    </NavLink>
                    <NavLink to="/adoptie" onClick={() => setOpen(false)}>
                        Adopție
                    </NavLink>
                    <NavLink to="/pierdute" onClick={() => setOpen(false)}>
                        Pierdute
                    </NavLink>
                    <NavLink to="/veterinari" onClick={() => setOpen(false)}>
                        Veterinari
                    </NavLink>
                    <NavLink to="/ghid-medical" onClick={() => setOpen(false)}>
                        MedGuide
                    </NavLink>
                    <NavLink to="/donatii" onClick={() => setOpen(false)}>
                        Donații
                    </NavLink>
                    <NavLink to="/sitters" onClick={() => setOpen(false)}>
                        Sitters
                    </NavLink>
                    <NavLink to="/voluntariat" onClick={() => setOpen(false)}>
                        Voluntariat
                    </NavLink>
                    <NavLink to="/wiki" onClick={() => setOpen(false)}>
                        Wiki
                    </NavLink>
                    <NavLink to="/blog" onClick={() => setOpen(false)}>
                        Blog
                    </NavLink>
                    <NavLink to="/evenimente" onClick={() => setOpen(false)}>
                        Evenimente
                    </NavLink>
                    <NavLink to="/vanzari" onClick={() => setOpen(false)}>
                        Vânzări
                    </NavLink>
                    {!currentUser && (
                        <NavLink to="/login" onClick={() => setOpen(false)}>
                            Login
                        </NavLink>
                    )}
                </nav>

                {currentUser && (
                    <div className="navUser">
                        <span className="navUserBadge">
                            {currentUser.role === 'admin' ? '🔑' : '👤'} {currentUser.displayName}
                        </span>
                        <button
                            type="button"
                            className="navLogoutBtn"
                            onClick={() => { logout(); navigate('/login'); setOpen(false); }}
                        >
                            Logout
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    className="themeToggle"
                    onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
                    aria-label={toggleLabel}
                    title={toggleLabel}
                >
                    <span aria-hidden="true">{isDark ? "☀️" : "🌙"}</span>
                </button>

                {/* buton hamburger DOAR pe mobil */}
                <button
                    type="button"
                    className="menuBtn"
                    aria-label="Deschide meniul"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className="menuIcon" />
                </button>
            </div>

            {/* overlay pentru click în afara meniului */}
            <div
                className={`navOverlay ${open ? "show" : ""}`}
                onClick={() => setOpen(false)}
            />
        </header>
    );
}
