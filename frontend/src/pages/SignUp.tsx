import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function SignUp() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        setError(null);
        setSuccess(null);

        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError("Completeaza toate campurile.");
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
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>Register</h1>
                <p style={styles.subtitle}>Creeaza un cont nou PawMate.</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>
                        Nume
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="ex. Ana Popescu"
                            style={styles.input}
                        />
                    </label>

                    <label style={styles.label}>
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ex. ana@email.com"
                            style={styles.input}
                        />
                    </label>

                    <label style={styles.label}>
                        Parola
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Introdu parola"
                            style={styles.input}
                        />
                    </label>

                    <label style={styles.label}>
                        Confirma parola
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirma parola"
                            style={styles.input}
                        />
                    </label>

                    {error && <div style={styles.error}>{error}</div>}
                    {success && <div style={styles.success}>{success}</div>}

                    <button type="submit" disabled={isSubmitting} style={styles.button}>
                        {isSubmitting ? "Se creeaza..." : "Register"}
                    </button>
                </form>

                <p style={styles.footerText}>
                    Ai deja cont? <Link to="/login">Mergi la login</Link>
                </p>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#f6f3ff",
    },
    card: {
        width: "100%",
        maxWidth: "460px",
        background: "#ffffff",
        borderRadius: "20px",
        padding: "32px",
        boxShadow: "0 20px 50px rgba(61, 38, 102, 0.12)",
    },
    title: {
        margin: 0,
        marginBottom: "10px",
        textAlign: "center",
        color: "#6b4ea0",
        fontSize: "2rem",
        fontWeight: 800,
    },
    subtitle: {
        margin: 0,
        marginBottom: "24px",
        textAlign: "center",
        color: "#6b6b7a",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    label: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        fontWeight: 600,
        color: "#4d3a72",
    },
    input: {
        height: "46px",
        borderRadius: "12px",
        border: "1px solid #d8d2eb",
        padding: "0 14px",
        fontSize: "1rem",
        outline: "none",
    },
    button: {
        height: "48px",
        border: "none",
        borderRadius: "14px",
        background: "#6b4ea0",
        color: "#fff",
        fontWeight: 700,
        fontSize: "1rem",
        cursor: "pointer",
    },
    error: {
        borderRadius: "12px",
        background: "#ffe5e5",
        color: "#c62828",
        padding: "12px",
        fontSize: "0.95rem",
    },
    success: {
        borderRadius: "12px",
        background: "#e6f7ec",
        color: "#1b8a4b",
        padding: "12px",
        fontSize: "0.95rem",
    },
    footerText: {
        marginTop: "18px",
        textAlign: "center",
        color: "#6b6b7a",
    },
};
