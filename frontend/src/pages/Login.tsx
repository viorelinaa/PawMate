import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PasswordField } from "../components/PasswordField";
import "../styles/Login.css";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        setError(null);

        if (!email.trim() || !password.trim()) {
            setError("Completeaza emailul si parola.");
            return;
        }

        try {
            setIsSubmitting(true);
            await login(email.trim(), password);
            navigate("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Autentificare esuata.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h1>Login</h1>
                    <p>Autentifica-te in contul tau PawMate.</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            className="login-input"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ex. ana@email.com"
                        />
                    </div>

                    <PasswordField
                        label="Parola"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Introdu parola"
                        autoComplete="current-password"
                        inputClassName="login-input"
                        labelClassName="form-group login-field-label"
                        fieldClassName="login-password-field"
                    />

                    {error && <div className="login-error">{error}</div>}

                    <button type="submit" disabled={isSubmitting} className="login-button">
                        {isSubmitting ? "Se autentifica..." : "Login"}
                    </button>
                </form>

                <p className="signup-link">
                    Nu ai cont? <Link to="/signup">Creeaza unul</Link>
                </p>
            </div>
        </div>
    );
}
