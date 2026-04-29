import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { usePasswordValidation } from "../hooks/usePasswordValidation";
import { PasswordStrengthBar } from "../design-system/components/PasswordStrengthBar";
import { PasswordField } from "../components/PasswordField";
import "../styles/SignUp.css";

export default function SignUp() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const passwordValidation = usePasswordValidation(password);

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        setError(null);
        setSuccess(null);

        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError("Completeaza toate campurile.");
            return;
        }

        if (!passwordValidation.isValid) {
            setError("Parola nu respecta toate cerintele.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Parolele nu coincid.");
            return;
        }

        try {
            setIsSubmitting(true);

            await registerUser({
                name: name.trim(),
                email: email.trim(),
                password,
            });

            setSuccess("Cont creat cu succes. Vei fi redirectionat catre login.");

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Inregistrare esuata.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-box">
                <div className="signup-header">
                    <h1>Register</h1>
                    <p>Creeaza un cont nou PawMate.</p>
                </div>

                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="signup-name">Nume</label>
                        <input
                            id="signup-name"
                            className="signup-input"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="ex. Ana Popescu"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="signup-email">Email</label>
                        <input
                            id="signup-email"
                            className="signup-input"
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
                        autoComplete="new-password"
                        inputClassName="signup-input"
                        labelClassName="form-group signup-field-label"
                        fieldClassName="signup-password-field"
                    />

                    <PasswordStrengthBar validation={passwordValidation} password={password} />

                    <PasswordField
                        label="Confirma parola"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirma parola"
                        autoComplete="new-password"
                        inputClassName="signup-input"
                        labelClassName="form-group signup-field-label"
                        fieldClassName="signup-password-field"
                    />

                    {confirmPassword && password !== confirmPassword && (
                        <div className="login-error">Parolele nu coincid.</div>
                    )}

                    {error && <div className="login-error">{error}</div>}
                    {success && <div className="profile-feedback success">{success}</div>}

                    <button type="submit" disabled={isSubmitting} className="signup-button">
                        {isSubmitting ? "Se creeaza..." : "Register"}
                    </button>
                </form>

                <p className="login-link">
                    Ai deja cont? <Link to="/login">Mergi la login</Link>
                </p>
            </div>
        </div>
    );
}
