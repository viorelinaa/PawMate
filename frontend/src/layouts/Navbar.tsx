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

type Theme = "light" | "dark";

interface NavbarProps {
    theme: Theme;
    onToggleTheme: () => void;
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 768) setOpen(false);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const isDark = theme === "dark";
    const toggleLabel = isDark ? "Activează modul luminos" : "Activează modul întunecat";

    return (
        <header className="navbar">
            <NavLink to="/" className="logo" end>
                🐾 PawMate
            </NavLink>

            <div className="navRight">
                {/* link-uri */}
                {currentUser?.role === 'admin' ? (
                    <nav className={`links ${open ? "open" : ""}`}>
                        <NavLink to={paths.adminStatistici} onClick={() => setOpen(false)}>Statistici</NavLink>
                        <NavLink to={paths.adminPagini} onClick={() => setOpen(false)}>Pagini</NavLink>
                        <NavLink to={paths.adminUtilizatori} onClick={() => setOpen(false)}>Utilizatori</NavLink>
                    </nav>
                ) : (
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
                )}

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
                            <span className="navUserName">{currentUser.name}</span>
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
                    onClick={onToggleTheme}
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
