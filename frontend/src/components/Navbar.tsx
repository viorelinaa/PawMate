import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: "white",
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: 10,
    background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
});

export default function Navbar() {
    return (
        <header
            style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: 16,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
        >
            <div style={{ fontWeight: 700, marginRight: 12 }}>🐾 PawMate</div>

            <NavLink to="/" style={linkStyle} end>
                Home
            </NavLink>

            <NavLink to="/sitters" style={linkStyle}>
                Sitters
            </NavLink>

            <NavLink to="/login" style={linkStyle}>
                Login
            </NavLink>
        </header>
    );
}
