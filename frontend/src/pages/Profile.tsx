import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {

    getProfile,
    updateProfile,
    type UpdateUserProfilePayload,
    type UserProfile,
} from "../services/profileService";

const emptyForm: UpdateUserProfilePayload = {
    name: "",
    email: "",
    phone: "",
    city: "",
    bio: "",
};

export default function Profile() {
    const navigate = useNavigate();
    const { currentUser, isAuthenticated, logout, updateProfileBasics } = useAuth();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [form, setForm] = useState<UpdateUserProfilePayload>(emptyForm);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

 useEffect(() => {
    if (!isAuthenticated || !currentUser) {
        setIsLoading(false);
        return;
    }

    const userId = currentUser.id;

    async function loadProfile() {
        try {
            setIsLoading(true);
            const data = await getProfile(userId);
            setProfile(data);
            setForm({
                name: data.name,
                email: data.email,
                phone: data.phone,
                city: data.city,
                bio: data.bio,
            });
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-a putut incarca profilul.");
        } finally {
            setIsLoading(false);
        }
    }

    void loadProfile();
}, [currentUser, isAuthenticated]);

    function setField(field: keyof UpdateUserProfilePayload, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setError(null);
        setSuccess(null);
    }

    async function handleSave(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        if (!currentUser) {
            return;
        }

        if (!form.name.trim() || !form.email.trim()) {
            setError("Numele si emailul sunt obligatorii.");
            return;
        }

        try {
            setIsSaving(true);
            const updated = await updateProfile(currentUser.id, {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                city: form.city.trim(),
                bio: form.bio.trim(),
            });

            setProfile(updated);
            setForm({
                name: updated.name,
                email: updated.email,
                phone: updated.phone,
                city: updated.city,
                bio: updated.bio,
            });
            updateProfileBasics(updated.name, updated.email);
            setIsEditing(false);
            setSuccess("Profilul a fost actualizat cu succes.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-a putut salva profilul.");
        } finally {
            setIsSaving(false);
        }
    }

    if (!isAuthenticated || !currentUser) {
        return (
            <div style={styles.page}>
                <div style={styles.card}>
                    <h1 style={styles.title}>Profil</h1>
                    <p style={styles.muted}>Trebuie sa fii autentificat pentru a vedea profilul.</p>
                    <button style={styles.primaryButton} onClick={() => navigate("/login")}>
                        Mergi la login
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div style={styles.page}>
                <div style={styles.card}>
                    <h1 style={styles.title}>Profil</h1>
                    <p style={styles.muted}>Se incarca profilul...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={styles.page}>
                <div style={styles.card}>
                    <h1 style={styles.title}>Profil</h1>
                    <p style={styles.errorBox}>{error ?? "Profilul nu a putut fi incarcat."}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.wrapper}>
                <div style={styles.heroCard}>
                    <div style={styles.avatar}>
                        {profile.name.trim().slice(0, 1).toUpperCase() || "U"}
                    </div>

                    <div style={styles.heroText}>
                        <h1 style={styles.title}>Profilul meu</h1>
                        <p style={styles.heroName}>{profile.name}</p>
                        <p style={styles.heroSub}>
                            {profile.role === "admin" ? "Administrator" : "Utilizator"} · {profile.email}
                        </p>
                    </div>
                </div>

                {error && <div style={styles.errorBox}>{error}</div>}
                {success && <div style={styles.successBox}>{success}</div>}

                <div style={styles.contentGrid}>
                    <div style={styles.infoCard}>
                        <div style={styles.sectionHeader}>
                            <h2 style={styles.sectionTitle}>Informatii profil</h2>
                            {!isEditing && (
                                <button style={styles.primaryButton} onClick={() => setIsEditing(true)}>
                                    Editeaza
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            <div style={styles.infoList}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Nume</span>
                                    <span style={styles.infoValue}>{profile.name || "-"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Email</span>
                                    <span style={styles.infoValue}>{profile.email || "-"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Telefon</span>
                                    <span style={styles.infoValue}>{profile.phone || "Nu este completat"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Oras</span>
                                    <span style={styles.infoValue}>{profile.city || "Nu este completat"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Rol</span>
                                    <span style={styles.infoValue}>{profile.role}</span>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} style={styles.form}>
                                <label style={styles.label}>
                                    Nume
                                    <input
                                        style={styles.input}
                                        value={form.name}
                                        onChange={(e) => setField("name", e.target.value)}
                                    />
                                </label>

                                <label style={styles.label}>
                                    Email
                                    <input
                                        type="email"
                                        style={styles.input}
                                        value={form.email}
                                        onChange={(e) => setField("email", e.target.value)}
                                    />
                                </label>

                                <label style={styles.label}>
                                    Telefon
                                    <input
                                        style={styles.input}
                                        value={form.phone}
                                        onChange={(e) => setField("phone", e.target.value)}
                                    />
                                </label>

                                <label style={styles.label}>
                                    Oras
                                    <input
                                        style={styles.input}
                                        value={form.city}
                                        onChange={(e) => setField("city", e.target.value)}
                                    />
                                </label>

                                <label style={styles.label}>
                                    Despre mine
                                    <textarea
                                        style={styles.textarea}
                                        rows={5}
                                        value={form.bio}
                                        onChange={(e) => setField("bio", e.target.value)}
                                    />
                                </label>

                                <div style={styles.actions}>
                                    <button type="button" style={styles.secondaryButton} onClick={() => {
                                        setIsEditing(false);
                                        setForm({
                                            name: profile.name,
                                            email: profile.email,
                                            phone: profile.phone,
                                            city: profile.city,
                                            bio: profile.bio,
                                        });
                                        setError(null);
                                        setSuccess(null);
                                    }}>
                                        Anuleaza
                                    </button>
                                    <button type="submit" style={styles.primaryButton} disabled={isSaving}>
                                        {isSaving ? "Se salveaza..." : "Salveaza"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    <div style={styles.bioCard}>
                        <h2 style={styles.sectionTitle}>Despre mine</h2>
                        <p style={styles.bioText}>
                            {profile.bio || "Nu ai completat inca o descriere pentru profilul tau."}
                        </p>

                        <div style={styles.sideActions}>
                            <button style={styles.secondaryButton} onClick={() => navigate("/")}>
                                Inapoi acasa
                            </button>
                            <button
                                style={styles.logoutButton}
                                onClick={() => {
                                    logout();
                                    navigate("/login");
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        padding: "32px 20px",
        background: "linear-gradient(180deg, #f7f4ff 0%, #efe8ff 100%)",
    },
    wrapper: {
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    },
    heroCard: {
        display: "flex",
        gap: "20px",
        alignItems: "center",
        background: "#ffffff",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 18px 45px rgba(61, 38, 102, 0.10)",
    },
    avatar: {
        width: "88px",
        height: "88px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2rem",
        fontWeight: 800,
        color: "#fff",
        background: "#6b4ea0",
    },
    heroText: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    title: {
        margin: 0,
        color: "#6b4ea0",
        fontSize: "2rem",
        fontWeight: 800,
    },
    heroName: {
        margin: 0,
        fontSize: "1.25rem",
        fontWeight: 700,
        color: "#35244f",
    },
    heroSub: {
        margin: 0,
        color: "#6f6781",
    },
    contentGrid: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "24px",
    },
    infoCard: {
        background: "#ffffff",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 18px 45px rgba(61, 38, 102, 0.10)",
    },
    bioCard: {
        background: "#ffffff",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 18px 45px rgba(61, 38, 102, 0.10)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
    },
    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    sectionTitle: {
        margin: 0,
        color: "#4c3575",
        fontSize: "1.2rem",
        fontWeight: 800,
    },
    infoList: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },
    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
        paddingBottom: "12px",
        borderBottom: "1px solid #ede7f8",
    },
    infoLabel: {
        color: "#7a7291",
        fontWeight: 600,
    },
    infoValue: {
        color: "#2f2146",
        fontWeight: 600,
        textAlign: "right",
    },
    bioText: {
        margin: 0,
        color: "#4c4460",
        lineHeight: 1.6,
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
        color: "#4c3575",
        fontWeight: 700,
    },
    input: {
        height: "46px",
        borderRadius: "12px",
        border: "1px solid #d9d2eb",
        padding: "0 14px",
        fontSize: "1rem",
        outline: "none",
    },
    textarea: {
        borderRadius: "12px",
        border: "1px solid #d9d2eb",
        padding: "12px 14px",
        fontSize: "1rem",
        outline: "none",
        resize: "vertical",
    },
    actions: {
        display: "flex",
        gap: "12px",
        marginTop: "8px",
    },
    sideActions: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginTop: "auto",
    },
    primaryButton: {
        border: "none",
        borderRadius: "12px",
        background: "#6b4ea0",
        color: "#fff",
        padding: "12px 18px",
        fontWeight: 700,
        cursor: "pointer",
    },
    secondaryButton: {
        border: "1px solid #d7d1e9",
        borderRadius: "12px",
        background: "#fff",
        color: "#4c3575",
        padding: "12px 18px",
        fontWeight: 700,
        cursor: "pointer",
    },
    logoutButton: {
        border: "none",
        borderRadius: "12px",
        background: "#b33939",
        color: "#fff",
        padding: "12px 18px",
        fontWeight: 700,
        cursor: "pointer",
    },
    errorBox: {
        borderRadius: "14px",
        background: "#ffe7e7",
        color: "#b3261e",
        padding: "14px 16px",
    },
    successBox: {
        borderRadius: "14px",
        background: "#e8f7ee",
        color: "#1d7f49",
        padding: "14px 16px",
    },
    muted: {
        color: "#6f6781",
    },
    card: {
        width: "100%",
        maxWidth: "520px",
        margin: "80px auto",
        background: "#ffffff",
        borderRadius: "24px",
        padding: "28px",
        boxShadow: "0 18px 45px rgba(61, 38, 102, 0.10)",
        textAlign: "center",
    },
};
