import { useNavigate } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <p className="footerText">© PawMate. Creat cu ❤️ pentru animale.</p>
            <button className="btnDonate" onClick={() => navigate("/donatii")}>
                Donează Acum
            </button>
        </footer>
    );
}
