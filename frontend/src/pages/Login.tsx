import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PasswordField } from "../components/PasswordField";

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

            const role = await login(email.trim(), password);

            if (role === "admin") {
                navigate("/");
            } else {
                navigate("/");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Autentificare esuata.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>Login</h1>
                <p style={styles.subtitle}>Autentifica-te in contul tau PawMate.</p>

                <form onSubmit={handleSubmit} style={styles.form}>
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

                    <PasswordField
                        label="Parola"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Introdu parola"
                        inputStyle={styles.input}
                        labelStyle={styles.label}
                    />

                    {error && <div style={styles.error}>{error}</div>}

                    <button type="submit" disabled={isSubmitting} style={styles.button}>
                        {isSubmitting ? "Se autentifica..." : "Login"}
                    </button>
                </form>

                <p style={styles.footerText}>
                    Nu ai cont? <Link to="/signup">Creeaza unul</Link>
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
        maxWidth: "420px",
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
    footerText: {
        marginTop: "18px",
        textAlign: "center",
        color: "#6b6b7a",
    },
};
