import { Link } from "react-router-dom";
import "../styles/NotFound.css";

export default function NotFound() {
    return (
        <div className="nfWrap">
            <div className="nfCard">
                <div className="nfEmoji">🐾</div>

                <h1 className="nfTitle">404</h1>
                <p className="nfText">
                    Pagina nu există sau link-ul e greșit.
                </p>

                <div className="nfActions">
                    <Link className="nfBtn primary" to="/">
                        Înapoi acasă
                    </Link>
                </div>
            </div>
        </div>
    );
}
