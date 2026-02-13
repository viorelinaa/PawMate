import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    return (
        <header className="navbar">
            {/* LOGO CLICKABIL */}
            <NavLink to="/" className="logo" end>
                🐾 PawMate
            </NavLink>

            <nav className="links">
                <NavLink to="/" end>
                    Acasă
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
