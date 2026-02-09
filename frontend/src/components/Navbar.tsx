import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="logo">🐾 PawMate</div>

            <nav className="links">
                <NavLink to="/" end>
                    Home
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
