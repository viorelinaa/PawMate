import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { paths } from "../routes/paths";
import "../styles/Forbidden.css";

export default function Forbidden() {
    const { currentUser } = useAuth();
    const location = useLocation();

    const requestedPath =
        typeof location.state === "object" &&
        location.state !== null &&
        "from" in location.state &&
        typeof location.state.from === "string"
            ? location.state.from
            : null;

    return (
        <div className="fbWrap">
            <div className="fbCard">
                <span className="fbBadge">Access forbidden</span>
                <p className="fbCode">403</p>
                <h1 className="fbTitle">Acces interzis</h1>
                <p className="fbText">
                    Nu ai permisiunea necesară pentru a accesa această pagină.
                </p>

                {requestedPath ? (
                    <p className="fbPath">Ruta cerută: {requestedPath}</p>
                ) : null}

                <div className="fbActions">
                    <Link className="fbBtn primary" to={paths.home}>
                        Înapoi acasă
                    </Link>
                    {!currentUser ? (
                        <Link className="fbBtn" to={paths.login}>
                            Mergi la login
                        </Link>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
