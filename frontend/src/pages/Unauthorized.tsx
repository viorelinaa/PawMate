import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { paths } from "../routes/paths";
import "../styles/NotFound.css";

export default function Unauthorized() {
    const { currentUser } = useAuth();
    const location = useLocation();

    const requestedPath =
        typeof location.state === "object" &&
        location.state !== null &&
        "from" in location.state &&
        typeof location.state.from === "string"
            ? location.state.from
            : null;

    if (currentUser) {
        return <Navigate to={paths.home} replace />;
    }

    return (
        <div className="nfWrap">
            <div className="nfCard">
                <div className="nfEmoji">🐾</div>

                <h1 className="nfTitle">401</h1>
                <p className="nfText">
                    Trebuie să fii autentificat pentru a accesa această pagină.
                </p>

                {requestedPath ? (
                    <p className="nfText">Ruta cerută: {requestedPath}</p>
                ) : null}

                <div className="nfActions">
                    <Link className="nfBtn primary" to={paths.login}>
                        Mergi la login
                    </Link>
                    <Link className="nfBtn" to={paths.home}>
                        Înapoi acasă
                    </Link>
                </div>
            </div>
        </div>
    );
}
