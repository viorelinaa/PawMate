import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppButton } from "../components/AppButton";
import {
    getProfile,
    updateProfile,
    type UpdateUserProfilePayload,
    type UserProfile,
} from "../services/profileService";
import "../styles/profile.css";

type ProfileSection = "personal" | "pets" | "activity";

type ProfileFormState = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
};

function splitFullName(fullName: string) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return { firstName: "", lastName: "" };
    }

    if (parts.length === 1) {
        return { firstName: parts[0], lastName: "" };
    }

    return {
        firstName: parts[0],
        lastName: parts.slice(1).join(" "),
    };
}

function buildInitials(firstName: string, lastName: string) {
    const first = firstName.trim().charAt(0).toUpperCase();
    const last = lastName.trim().charAt(0).toUpperCase();
    return `${first}${last}`.trim() || "U";
}

function formatMemberSince(createdAt: string) {
    if (!createdAt) {
        return "recent";
    }

    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) {
        return "recent";
    }

    return new Intl.DateTimeFormat("ro-RO", {
        month: "long",
        year: "numeric",
    }).format(date);
}

function roleLabel(role: string) {
    return role === "admin" ? "Administrator" : "Adoptator";
}

const emptyForm: ProfileFormState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
};

export default function Profile() {
    const navigate = useNavigate();
    const { currentUser, isAuthenticated, logout, updateProfileBasics } = useAuth();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [form, setForm] = useState<ProfileFormState>(emptyForm);
    const [activeSection, setActiveSection] = useState<ProfileSection>("personal");
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
                const nameParts = splitFullName(data.name);

                setProfile(data);
                setForm({
                    firstName: nameParts.firstName,
                    lastName: nameParts.lastName,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
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

    function setField(field: keyof ProfileFormState, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setError(null);
        setSuccess(null);
    }

    async function handleSave(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        if (!currentUser || !profile) {
            return;
        }

        if (!form.firstName.trim() || !form.email.trim()) {
            setError("Prenumele si emailul sunt obligatorii.");
            return;
        }

        const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

        try {
            setIsSaving(true);

            const payload: UpdateUserProfilePayload = {
                name: fullName,
                email: form.email.trim(),
                phone: form.phone.trim(),
                address: form.address.trim(),
                city: profile.city ?? "",
                bio: profile.bio ?? "",
            };

            const updated = await updateProfile(currentUser.id, payload);
            const updatedNameParts = splitFullName(updated.name);

            setProfile(updated);
            setForm({
                firstName: updatedNameParts.firstName,
                lastName: updatedNameParts.lastName,
                email: updated.email,
                phone: updated.phone,
                address: updated.address,
            });

            updateProfileBasics(updated.name, updated.email);
            setSuccess("Datele personale au fost actualizate cu succes.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-au putut salva modificarile.");
        } finally {
            setIsSaving(false);
        }
    }

    if (!isAuthenticated || !currentUser) {
        return (
            <div className="profile-page">
                <div className="profile-shell">
                    <div className="profile-main-card">
                        <h1 className="profile-main-title">Profilul meu</h1>
                        <div className="profile-feedback error">
                            Trebuie sa fii autentificat pentru a vedea profilul.
                        </div>
                        <div className="profile-actions">
                            <AppButton
                                variant="primary"
                                size="md"
                                className="profile-btn profile-btn-primary"
                                onClick={() => navigate("/login")}
                            >
                                Mergi la login
                            </AppButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="profile-page">
                <div className="profile-shell">
                    <div className="profile-main-card">
                        <h1 className="profile-main-title">Profilul meu</h1>
                        <p className="profile-placeholder">Se incarca profilul...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="profile-page">
                <div className="profile-shell">
                    <div className="profile-main-card">
                        <h1 className="profile-main-title">Profilul meu</h1>
                        <div className="profile-feedback error">
                            {error ?? "Profilul nu a putut fi incarcat."}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const initials = buildInitials(form.firstName, form.lastName);
    const memberSince = formatMemberSince(profile.createdAt);

    return (
        <div className="profile-page">
            <div className="profile-shell">
                <div className="profile-layout">
                    <aside className="profile-sidebar">
                        <div className="profile-avatar">{initials}</div>
                        <h2 className="profile-user-name">
                            {[form.firstName, form.lastName].filter(Boolean).join(" ") || profile.name}
                        </h2>
                        <p className="profile-user-role">{roleLabel(profile.role)}</p>
                        <p className="profile-member-date">Membru din {memberSince}</p>

                        <div className="profile-sidebar-nav">
                            <button
                                className={`profile-nav-button ${activeSection === "personal" ? "active" : ""}`}
                                onClick={() => setActiveSection("personal")}
                                type="button"
                            >
                                Date personale
                            </button>
                            <button
                                className={`profile-nav-button ${activeSection === "pets" ? "active" : ""}`}
                                onClick={() => setActiveSection("pets")}
                                type="button"
                            >
                                Animalele mele
                            </button>
                            <button
                                className={`profile-nav-button ${activeSection === "activity" ? "active" : ""}`}
                                onClick={() => setActiveSection("activity")}
                                type="button"
                            >
                                Activitate
                            </button>
                        </div>

                        <AppButton
                            type="button"
                            variant="outline"
                            size="md"
                            fullWidth
                            className="profile-btn profile-btn-logout"
                            onClick={() => {
                                logout();
                                navigate("/login");
                            }}
                        >
                            Deconectare
                        </AppButton>
                    </aside>

                    <main className="profile-main-card">
                        {error && <div className="profile-feedback error">{error}</div>}
                        {success && <div className="profile-feedback success">{success}</div>}

                        {activeSection === "personal" ? (
                            <>
                                <h1 className="profile-main-title">Date personale</h1>
                                <hr className="profile-main-divider" />

                                <form onSubmit={handleSave}>
                                    <div className="profile-form-grid">
                                        <div className="profile-field">
                                            <label className="profile-label">Prenume</label>
                                            <input
                                                className="profile-input"
                                                value={form.firstName}
                                                onChange={(e) => setField("firstName", e.target.value)}
                                                placeholder="Prenume"
                                            />
                                        </div>

                                        <div className="profile-field">
                                            <label className="profile-label">Nume</label>
                                            <input
                                                className="profile-input"
                                                value={form.lastName}
                                                onChange={(e) => setField("lastName", e.target.value)}
                                                placeholder="Nume"
                                            />
                                        </div>

                                        <div className="profile-field">
                                            <label className="profile-label">Email</label>
                                            <input
                                                type="email"
                                                className="profile-input"
                                                value={form.email}
                                                onChange={(e) => setField("email", e.target.value)}
                                                placeholder="Email"
                                            />
                                        </div>

                                        <div className="profile-field">
                                            <label className="profile-label">Telefon</label>
                                            <input
                                                className="profile-input"
                                                value={form.phone}
                                                onChange={(e) => setField("phone", e.target.value)}
                                                placeholder="+373..."
                                            />
                                        </div>

                                        <div className="profile-field full">
                                            <label className="profile-label">Adresa</label>
                                            <input
                                                className="profile-input"
                                                value={form.address}
                                                onChange={(e) => setField("address", e.target.value)}
                                                placeholder="Chisinau, str. Exemplu 1"
                                            />
                                        </div>
                                    </div>

                                    <div className="profile-actions">
                                        <AppButton
                                            type="submit"
                                            variant="primary"
                                            size="md"
                                            className="profile-btn profile-btn-primary"
                                            disabled={isSaving}
                                        >
                                            {isSaving ? "Se salveaza..." : "Salveaza modificarile"}
                                        </AppButton>

                                        <AppButton
                                            type="button"
                                            variant="ghost"
                                            size="md"
                                            className="profile-btn profile-btn-secondary"
                                            onClick={() => navigate("/")}
                                        >
                                            Inapoi acasa
                                        </AppButton>
                                    </div>
                                </form>
                            </>
                        ) : activeSection === "pets" ? (
                            <>
                                <h1 className="profile-main-title">Animalele mele</h1>
                                <hr className="profile-main-divider" />
                                <p className="profile-placeholder">
                                    Momentan nu ai animale adaugate in profil.
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="profile-main-title">Activitate</h1>
                                <hr className="profile-main-divider" />
                                <p className="profile-placeholder">
                                    Momentan nu exista activitate afisata in profil.
                                </p>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
