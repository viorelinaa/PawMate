import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    // când treci pe desktop, închide meniul (ca să nu rămână "open" din mobil)
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 768) setOpen(false);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return (
        <header className="navbar">
            <NavLink to="/" className="logo" end>
                🐾 PawMate
            </NavLink>

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

            {/* overlay pentru click în afara meniului */}
            <div
                className={`navOverlay ${open ? "show" : ""}`}
                onClick={() => setOpen(false)}
            />

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
                <NavLink to="/login" onClick={() => setOpen(false)}>
                    Login
                </NavLink>
            </nav>
        </header>
    );
}
