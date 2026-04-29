import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppButton } from "../components/AppButton";
import {
    createProfileAvatarOption,
    getProfile,
    getProfileAvatarOptions,
    updateProfileAvatar,
    updateProfile,
    type ProfileAvatarOption,
    type UpdateUserProfilePayload,
    type UserProfile,
} from "../services/profileService";
import "../styles/Profile.css";

type ProfileSection = "personal" | "avatar" | "pets" | "activity";

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

function formatQuizCompletedAt(completedAt: string) {
    if (!completedAt) {
        return "recent";
    }

    const date = new Date(completedAt);
    if (Number.isNaN(date.getTime())) {
        return "recent";
    }

    return new Intl.DateTimeFormat("ro-RO", {
        dateStyle: "long",
        timeStyle: "short",
    }).format(date);
}

function formatQuizCompatibility(score: number, totalQuestions: number) {
    if (totalQuestions <= 0) {
        return "Compatibilitate indisponibilă";
    }

    const percent =
        totalQuestions === 100
            ? score
            : Math.round((score / totalQuestions) * 100);

    return `${percent}% compatibilitate`;
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
    const [avatarOptions, setAvatarOptions] = useState<ProfileAvatarOption[]>([]);
    const [avatarTitle, setAvatarTitle] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [form, setForm] = useState<ProfileFormState>(emptyForm);
    const [activeSection, setActiveSection] = useState<ProfileSection>("personal");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingAvatar, setIsAddingAvatar] = useState(false);
    const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
    const [avatarSelectionInFlight, setAvatarSelectionInFlight] = useState<number | null>(null);
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
                const [profileData, avatarData] = await Promise.all([
                    getProfile(userId),
                    getProfileAvatarOptions(),
                ]);
                const nameParts = splitFullName(profileData.name);

                setProfile(profileData);
                setAvatarOptions(avatarData);
                setForm({
                    firstName: nameParts.firstName,
                    lastName: nameParts.lastName,
                    email: profileData.email,
                    phone: profileData.phone,
                    address: profileData.address,
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

    useEffect(() => {
        if (activeSection !== "avatar") {
            setIsAvatarPickerOpen(false);
        }
    }, [activeSection]);

    function setField(field: keyof ProfileFormState, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setError(null);
        setSuccess(null);
    }

    function openAvatarSection(openPicker = false) {
        setActiveSection("avatar");
        setIsAvatarPickerOpen(openPicker);
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

    async function handleAddAvatar(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        if (!avatarUrl.trim()) {
            setError("Introdu un URL valid pentru avatar.");
            return;
        }

        try {
            setIsAddingAvatar(true);
            const createdAvatar = await createProfileAvatarOption({
                title: avatarTitle.trim(),
                imageUrl: avatarUrl.trim(),
            });

            setAvatarOptions((prev) => {
                const filtered = prev.filter((avatar) => avatar.id !== createdAvatar.id);
                return [createdAvatar, ...filtered];
            });
            setAvatarTitle("");
            setAvatarUrl("");
            setError(null);
            setSuccess("Avatarul a fost adaugat in biblioteca. Il poti selecta imediat.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-a putut adauga avatarul.");
        } finally {
            setIsAddingAvatar(false);
        }
    }

    async function handleSelectAvatar(avatarId: number) {
        if (!currentUser) {
            return;
        }

        try {
            setAvatarSelectionInFlight(avatarId);
            const updatedProfile = await updateProfileAvatar(currentUser.id, avatarId);
            setProfile(updatedProfile);
            setIsAvatarPickerOpen(false);
            setError(null);
            setSuccess("Poza de profil a fost actualizata cu succes.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-a putut actualiza poza de profil.");
        } finally {
            setAvatarSelectionInFlight(null);
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
    const quizResults = profile.quizResults ?? [];
    const latestQuizResult = profile.latestQuizResult ?? quizResults[0] ?? null;
    const selectedAvatarId = profile.selectedAvatar?.id ?? null;

    return (
        <div className="profile-page">
            <div className="profile-shell">
                <div className="profile-layout">
                    <aside className="profile-sidebar">
                        <button
                            type="button"
                            className="profile-avatar profile-avatar-button"
                            onClick={() => openAvatarSection(true)}
                        >
                            {profile.selectedAvatar ? (
                                <img
                                    className="profile-avatar-image"
                                    src={profile.selectedAvatar.imageUrl}
                                    alt={profile.selectedAvatar.title || "Poza de profil"}
                                />
                            ) : (
                                initials
                            )}
                        </button>
                        <h2 className="profile-user-name">
                            {[form.firstName, form.lastName].filter(Boolean).join(" ") || profile.name}
                        </h2>
                        <p className="profile-user-role">{roleLabel(profile.role)}</p>
                        <p className="profile-member-date">Membru din {memberSince}</p>
                        <div className="profile-quiz-summary">
                            <span className="profile-quiz-summary-label">Ultimul quiz</span>
                            {latestQuizResult ? (
                                <>
                                    <strong className="profile-quiz-summary-name">
                                        {latestQuizResult.animalName}
                                    </strong>
                                    <span className="profile-quiz-summary-meta">
                                        {formatQuizCompatibility(latestQuizResult.score, latestQuizResult.totalQuestions)}
                                    </span>
                                    <span className="profile-quiz-summary-date">
                                        {formatQuizCompletedAt(latestQuizResult.completedAt)}
                                    </span>
                                </>
                            ) : (
                                <span className="profile-quiz-summary-empty">
                                    Inca nu ai rezultate salvate.
                                </span>
                            )}
                        </div>

                        <div className="profile-sidebar-nav">
                            <button
                                className={`profile-nav-button ${activeSection === "personal" ? "active" : ""}`}
                                onClick={() => setActiveSection("personal")}
                                type="button"
                            >
                                Date personale
                            </button>
                            <button
                                className={`profile-nav-button ${activeSection === "avatar" ? "active" : ""}`}
                                onClick={() => openAvatarSection(false)}
                                type="button"
                            >
                                Avatar
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
                        ) : activeSection === "avatar" ? (
                            <>
                                <h1 className="profile-main-title">Poza de profil</h1>
                                <hr className="profile-main-divider" />

                                <div className="profile-avatar-stack">
                                    <button
                                        type="button"
                                        className={`profile-avatar-card profile-avatar-current-trigger ${
                                            isAvatarPickerOpen ? "is-open" : ""
                                        }`}
                                        onClick={() => setIsAvatarPickerOpen((prev) => !prev)}
                                        aria-expanded={isAvatarPickerOpen}
                                    >
                                        <p className="profile-avatar-card-label">Avatar curent</p>
                                        <div className="profile-avatar-preview">
                                            {profile.selectedAvatar ? (
                                                <img
                                                    className="profile-avatar-preview-image"
                                                    src={profile.selectedAvatar.imageUrl}
                                                    alt={profile.selectedAvatar.title || "Avatar selectat"}
                                                />
                                            ) : (
                                                <div className="profile-avatar-preview-fallback">{initials}</div>
                                            )}
                                        </div>
                                        <h2 className="profile-avatar-card-title">
                                            {profile.selectedAvatar?.title || "Nu ai selectat inca un avatar"}
                                        </h2>
                                        <p className="profile-avatar-card-copy">
                                            Apasa pe avatar pentru a {isAvatarPickerOpen ? "ascunde" : "vedea"} optiunile
                                            disponibile si pentru a alege altul.
                                        </p>
                                        <span className="profile-avatar-current-action">
                                            {isAvatarPickerOpen ? "Ascunde selectorul" : "Schimba avatarul"}
                                        </span>
                                    </button>

                                    {isAvatarPickerOpen ? (
                                        <>
                                            <section className="profile-avatar-card">
                                                <p className="profile-avatar-card-label">Biblioteca de avataruri</p>
                                                {avatarOptions.length > 0 ? (
                                                    <div className="profile-avatar-grid">
                                                        {avatarOptions.map((avatar) => (
                                                            <button
                                                                key={avatar.id}
                                                                type="button"
                                                                className={`profile-avatar-option ${
                                                                    selectedAvatarId === avatar.id ? "is-selected" : ""
                                                                }`}
                                                                onClick={() => handleSelectAvatar(avatar.id)}
                                                                disabled={avatarSelectionInFlight === avatar.id}
                                                            >
                                                                <img
                                                                    className="profile-avatar-option-image"
                                                                    src={avatar.imageUrl}
                                                                    alt={avatar.title}
                                                                />
                                                                <span className="profile-avatar-option-title">
                                                                    {avatar.title}
                                                                </span>
                                                                <span className="profile-avatar-option-action">
                                                                    {selectedAvatarId === avatar.id
                                                                        ? "Selectat"
                                                                        : avatarSelectionInFlight === avatar.id
                                                                            ? "Se salveaza..."
                                                                            : "Alege"}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="profile-placeholder">
                                                        Nu exista avataruri disponibile inca.
                                                    </p>
                                                )}
                                            </section>

                                            <section className="profile-avatar-form-card">
                                                <h2 className="profile-avatar-form-title">Adauga un URL nou</h2>
                                                <p className="profile-placeholder">
                                                    URL-ul va fi salvat in baza de date si va deveni disponibil pentru
                                                    selectie.
                                                </p>

                                                <form onSubmit={handleAddAvatar}>
                                                    <div className="profile-form-grid">
                                                        <div className="profile-field">
                                                            <label className="profile-label">Titlu avatar</label>
                                                            <input
                                                                className="profile-input"
                                                                value={avatarTitle}
                                                                onChange={(e) => setAvatarTitle(e.target.value)}
                                                                placeholder="Ex. Pisica pastel"
                                                            />
                                                        </div>

                                                        <div className="profile-field full">
                                                            <label className="profile-label">URL imagine</label>
                                                            <input
                                                                className="profile-input"
                                                                type="url"
                                                                value={avatarUrl}
                                                                onChange={(e) => setAvatarUrl(e.target.value)}
                                                                placeholder="https://exemplu.com/avatar.png"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="profile-actions">
                                                        <AppButton
                                                            type="submit"
                                                            variant="primary"
                                                            size="md"
                                                            className="profile-btn profile-btn-primary"
                                                            disabled={isAddingAvatar}
                                                        >
                                                            {isAddingAvatar ? "Se adauga..." : "Adauga avatar"}
                                                        </AppButton>
                                                    </div>
                                                </form>
                                            </section>
                                        </>
                                    ) : null}
                                </div>
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
                                {quizResults.length > 0 ? (
                                    <div className="profile-activity-list">
                                        {quizResults.map((quizResult, index) => (
                                            <article key={quizResult.id} className="profile-activity-card">
                                                <p className="profile-activity-label">
                                                    {index === 0 ? "Cel mai recent rezultat" : `Rezultatul #${quizResults.length - index}`}
                                                </p>
                                                <h2 className="profile-activity-title">{quizResult.animalName}</h2>
                                                <p className="profile-activity-copy">
                                                    {formatQuizCompatibility(quizResult.score, quizResult.totalQuestions)}.
                                                    Rezultatul a fost salvat automat dupa finalizarea quiz-ului.
                                                </p>
                                                <p className="profile-activity-meta">
                                                    Salvat la {formatQuizCompletedAt(quizResult.completedAt)}
                                                </p>
                                            </article>
                                        ))}

                                        <div className="profile-actions">
                                            <AppButton
                                                type="button"
                                                variant="primary"
                                                size="md"
                                                className="profile-btn profile-btn-primary"
                                                onClick={() => navigate("/quiz")}
                                            >
                                                Refa quiz-ul
                                            </AppButton>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="profile-placeholder">
                                            Inca nu ai niciun rezultat de quiz salvat.
                                        </p>
                                        <div className="profile-actions">
                                            <AppButton
                                                type="button"
                                                variant="primary"
                                                size="md"
                                                className="profile-btn profile-btn-primary"
                                                onClick={() => navigate("/quiz")}
                                            >
                                                Mergi la quiz
                                            </AppButton>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
