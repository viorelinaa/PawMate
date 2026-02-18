import { useNavigate } from "react-router-dom";
import "../styles/Footer.css";
import { HandCoinsIcon } from "../components/HandCoinsIcon";

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <p className="footerText">© PawMate. Creat cu ❤️ pentru animale.</p>
            <button className="btnDonate" onClick={() => navigate("/donatii")}>
                <HandCoinsIcon size={16} aria-hidden="true" />
                Donează Acum
            </button>
        </footer>
    );
}
