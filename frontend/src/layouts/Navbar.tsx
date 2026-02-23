import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext";
import { MoonIcon } from "../components/MoonIcon";
import { SunIcon } from "../components/SunIcon";
import { UserRoundIcon } from "../components/UserRoundIcon";
import { ShieldUserIcon } from "../components/ShieldUserIcon";
import { LogoutIcon } from "../components/LogoutIcon";
import { paths } from "../routes/paths";

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
                    <NavLink to="/" end onClick={() => setOpen(false)}>Acasă</NavLink>
                    <NavLink to="/quiz" onClick={() => setOpen(false)}>Quiz</NavLink>
                    <NavLink to="/adoptie" onClick={() => setOpen(false)}>Adopție</NavLink>
                    <NavLink to="/pierdute" onClick={() => setOpen(false)}>Pierdute</NavLink>
                    <NavLink to="/veterinari" onClick={() => setOpen(false)}>Veterinari</NavLink>
                    <NavLink to="/ghid-medical" onClick={() => setOpen(false)}>MedGuide</NavLink>
                    <NavLink to="/donatii" onClick={() => setOpen(false)}>Donații</NavLink>
                    <NavLink to="/sitters" onClick={() => setOpen(false)}>Sitters</NavLink>
                    <NavLink to="/voluntariat" onClick={() => setOpen(false)}>Voluntariat</NavLink>
                    <NavLink to="/wiki" onClick={() => setOpen(false)}>Wiki</NavLink>
                    <NavLink to="/blog" onClick={() => setOpen(false)}>Blog</NavLink>
                    <NavLink to="/evenimente" onClick={() => setOpen(false)}>Evenimente</NavLink>
                    <NavLink to="/vanzari" onClick={() => setOpen(false)}>Vânzări</NavLink>
                    {!currentUser && (
                        <NavLink to="/login" onClick={() => setOpen(false)}>Login</NavLink>
                    )}
                </nav>

                {currentUser && (
                    <div className="navUser">
                        {/* Badge user — click duce la profil */}
                        <button
                            type="button"
                            className={`navUserBadge ${currentUser.role === 'admin' ? 'isAdmin' : 'isUser'}`}
                            onClick={() => { navigate(paths.profile); setOpen(false); }}
                            aria-label="Vezi profilul tău"
                            title="Profilul meu"
                        >
                            <span className="navUserEmoji">
                                {currentUser.role === 'admin' ? '🔑' : '👤'}
                            </span>
                            <span className="navUserName">{currentUser.displayName}</span>
                            <span className="navUserIcon" aria-hidden="true">
                                {currentUser.role === 'admin' ? (
                                    <ShieldUserIcon size={16} />
                                ) : (
                                    <UserRoundIcon size={16} />
                                )}
                            </span>
                        </button>

                        <button
                            type="button"
                            className="navLogoutBtn"
                            onClick={() => { logout(); navigate(paths.login); setOpen(false); }}
                            aria-label="Logout"
                            title="Logout"
                        >
                            <LogoutIcon size={18} aria-hidden="true" />
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
                    {isDark ? (
                        <SunIcon size={20} aria-hidden="true" />
                    ) : (
                        <MoonIcon size={20} aria-hidden="true" />
                    )}
                </button>

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

            <div
                className={`navOverlay ${open ? "show" : ""}`}
                onClick={() => setOpen(false)}
            />
        </header>
    );
}