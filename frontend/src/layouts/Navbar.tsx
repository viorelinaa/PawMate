import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    return (
        <header className="navbar">
            {/* LOGO CLICKABIL */}
            <NavLink to="/" className="logo" end>
                🐾 PawMate
            </NavLink>

            {/* BUTON MENIU MOBIL */}
            <button
                className="menuBtn"
                onClick={() => setOpen(!open)}
                aria-label="Deschide meniul"
            >
                ☰
            </button>

            <nav className="links">
                <NavLink to="/" end>
                    Acasă
                </NavLink>

                <NavLink to="/quiz">
                    Quiz
                </NavLink>

                <NavLink to="/adoptie">
                    Adopție
                </NavLink>

                <NavLink to="/pierdute">
                    Pierdute
                </NavLink>

                <NavLink to="/donatii">
                    Donații
                </NavLink>

                <NavLink to="/sitters">
                    Sitters
                </NavLink>

                <NavLink to="/login">
                    Login
                </NavLink>
            </nav>
        </header>
    );
}
