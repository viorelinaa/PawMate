import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../axios/useApi";
import { paths } from "../routes/paths";
import "../styles/NotFound.css";

export default function ServerError() {
    const navigate = useNavigate();
    const { checkBackendHealth, isCheckingHealth } = useApi();
    const [errorMessage, setErrorMessage] = useState("");

    const handleRetry = async () => {
        setErrorMessage("");

        const isHealthy = await checkBackendHealth();
        if (isHealthy) {
            navigate(paths.home, { replace: true });
            return;
        }

        setErrorMessage("Backend-ul este încă indisponibil.");
    };

    return (
        <div className="nfWrap">
            <div className="nfCard">
                <div className="nfEmoji">🛠️</div>
                <h1 className="nfTitle">500</h1>
                <p className="nfText">
                    Serverul backend nu răspunde sau a apărut o eroare internă.
                </p>

                {errorMessage ? <p className="nfText">{errorMessage}</p> : null}

                <div className="nfActions">
                    <button
                        type="button"
                        className="nfBtn primary"
                        onClick={handleRetry}
                        disabled={isCheckingHealth}
                    >
                        {isCheckingHealth ? "Reconectare..." : "Încearcă din nou"}
                    </button>
                </div>
            </div>
        </div>
    );
}
