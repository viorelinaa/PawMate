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
                    Home
                </NavLink>

                <NavLink to="/pet-sitting">
                    Sitters
                </NavLink>

                <NavLink to="/login">
                    Login
                </NavLink>
            </nav>
        </header>
    );
}
