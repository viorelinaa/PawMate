import { useState } from "react";
import { AppButton } from "./AppButton";
import { FilterSelect } from "./FilterSelect";
import { useAuth } from "../context/AuthContext";
import {
    getSitters,
    createSitter,
    updateSitter,
    deleteSitter,
    rateSitter,
    getSitterReviews,
} from "../services/sitterService";
import type { Sitter, SitterRatingInfo, SitterReview } from "../services/sitterService";

export { getSitters };

export const sitterCityOptions = ["Chisinau", "Balti", "Cahul", "Orhei", "Ungheni", "Soroca", "Comrat"];
export const sitterServiceOptions = ["Plimbari", "Ingrijire la domiciliu", "Pet sitting", "Hranire", "Altul"];
export const sitterPetTypeOptions = ["Orice", "Caini", "Pisici", "Pasari", "Rozatoare", "Reptile"];

// ── Tipuri formular ───────────────────────────────────────────────────────────
export interface SitterForm {
    name: string;
    city: string;
    services: string;
    acceptedPetTypes: string;
    pricePerDay: string;
    description: string;
}

export const emptySitterForm: SitterForm = {
    name: "",
    city: "",
    services: "",
    acceptedPetTypes: "Orice",
    pricePerDay: "",
    description: "",
};

export function sitterToForm(s: Sitter): SitterForm {
    return {
        name: s.name,
        city: s.city,
        services: s.services,
        acceptedPetTypes: s.acceptedPetTypes ?? "Orice",
        pricePerDay: String(s.pricePerDay),
        description: s.description ?? "",
    };
}

function validateSitterForm(form: SitterForm): Partial<Record<keyof SitterForm, string>> {
    const e: Partial<Record<keyof SitterForm, string>> = {};
    if (!form.name.trim()) e.name = "Numele este obligatoriu.";
    if (!form.city.trim()) e.city = "Orasul este obligatoriu.";
    if (!form.services) e.services = "Selecteaza tipul de serviciu.";
    if (!form.acceptedPetTypes) e.acceptedPetTypes = "Selecteaza tipul de animal.";
    if (!form.pricePerDay.trim()) e.pricePerDay = "Pretul este obligatoriu.";
    else if (isNaN(Number(form.pricePerDay)) || Number(form.pricePerDay) <= 0)
        e.pricePerDay = "Introdu un pret valid.";
    return e;
}

// ── Formular comun ────────────────────────────────────────────────────────────
export function SitterFormFields({
    form,
    errors,
    loading,
    apiError,
    submitLabel,
    onSubmit,
    onChange,
    onClose,
}: {
    form: SitterForm;
    errors: Partial<Record<keyof SitterForm, string>>;
    loading: boolean;
    apiError: string | null;
    submitLabel: string;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (field: keyof SitterForm, value: string) => void;
    onClose: () => void;
}) {
    return (
        <form className="sitterModalForm" onSubmit={onSubmit} noValidate>
            <div className="sitterModalRow">
                <div className="sitterModalField">
                    <label className="sitterModalLabel">Nume *</label>
                    <input
                        className={`sitterModalInput${errors.name ? " sitterInputError" : ""}`}
                        placeholder="ex. Ana"
                        value={form.name}
                        onChange={(e) => onChange("name", e.target.value)}
                    />
                    {errors.name && <span className="sitterFieldError">{errors.name}</span>}
                </div>
                <div className="sitterModalField">
                    <label className="sitterModalLabel">Oras *</label>
                    <FilterSelect
                        className={errors.city ? "fs-error" : ""}
                        value={form.city}
                        onChange={(e) => onChange("city", e.target.value)}
                    >
                        <option value="">Selecteaza orasul</option>
                        {sitterCityOptions.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </FilterSelect>
                    {errors.city && <span className="sitterFieldError">{errors.city}</span>}
                </div>
            </div>

            <div className="sitterModalRow">
                <div className="sitterModalField">
                    <label className="sitterModalLabel">Tip serviciu *</label>
                    <FilterSelect
                        className={errors.services ? "fs-error" : ""}
                        value={form.services}
                        onChange={(e) => onChange("services", e.target.value)}
                    >
                        <option value="">Selecteaza serviciul</option>
                        {sitterServiceOptions.map((service) => (
                            <option key={service} value={service}>{service}</option>
                        ))}
                    </FilterSelect>
                    {errors.services && <span className="sitterFieldError">{errors.services}</span>}
                </div>
                <div className="sitterModalField">
                    <label className="sitterModalLabel">Pret / zi (MDL) *</label>
                    <input
                        type="number"
                        min="1"
                        className={`sitterModalInput${errors.pricePerDay ? " sitterInputError" : ""}`}
                        placeholder="ex. 250"
                        value={form.pricePerDay}
                        onChange={(e) => onChange("pricePerDay", e.target.value)}
                    />
                    {errors.pricePerDay && <span className="sitterFieldError">{errors.pricePerDay}</span>}
                </div>
            </div>

            <div className="sitterModalField">
                <label className="sitterModalLabel">Tip animal acceptat *</label>
                <FilterSelect
                    className={errors.acceptedPetTypes ? "fs-error" : ""}
                    value={form.acceptedPetTypes}
                    onChange={(e) => onChange("acceptedPetTypes", e.target.value)}
                >
                    {sitterPetTypeOptions.map((petType) => (
                        <option key={petType} value={petType}>{petType}</option>
                    ))}
                </FilterSelect>
                {errors.acceptedPetTypes && <span className="sitterFieldError">{errors.acceptedPetTypes}</span>}
            </div>

            <div className="sitterModalField">
                <label className="sitterModalLabel">Descriere</label>
                <textarea
                    className="sitterModalTextarea"
                    placeholder="Descrie experienta, animalele acceptate si programul disponibil..."
                    value={form.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    rows={3}
                />
            </div>

            {apiError && <p className="sitterFieldError" style={{ textAlign: "center" }}>{apiError}</p>}

            <div className="sitterModalActions">
                <AppButton type="button" variant="ghost" onClick={onClose} disabled={loading}>
                    Anuleaza
                </AppButton>
                <AppButton type="submit" variant="primary" disabled={loading}>
                    {loading ? "Se salveaza..." : submitLabel}
                </AppButton>
            </div>
        </form>
    );
}

// ── Modal Adaugare ────────────────────────────────────────────────────────────
export function AddSitterModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
    const [form, setForm] = useState<SitterForm>(emptySitterForm);
    const [errors, setErrors] = useState<Partial<Record<keyof SitterForm, string>>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validateSitterForm(form);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        setApiError(null);
        try {
            await createSitter({
                name: form.name.trim(),
                city: form.city.trim(),
                services: form.services,
                acceptedPetTypes: form.acceptedPetTypes,
                pricePerDay: Number(form.pricePerDay),
                description: form.description.trim(),
            });
            onAdded();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscuta.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof SitterForm, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    return (
        <div className="sitterModalOverlay" onClick={onClose}>
            <div className="sitterModalBox" onClick={(e) => e.stopPropagation()}>
                <div className="sitterModalHeader">
                    <h2 className="sitterModalTitle">Adauga profil sitter</h2>
                    <button className="sitterModalClose" onClick={onClose} aria-label="Inchide">×</button>
                </div>
                <SitterFormFields
                    form={form} errors={errors} loading={loading} apiError={apiError}
                    submitLabel="Adauga profil"
                    onSubmit={handleSubmit} onChange={handleChange} onClose={onClose}
                />
            </div>
        </div>
    );
}

// ── Modal Editare ─────────────────────────────────────────────────────────────
export function EditSitterModal({
    sitter,
    onClose,
    onUpdated,
}: {
    sitter: Sitter;
    onClose: () => void;
    onUpdated: () => void;
}) {
    const [form, setForm] = useState<SitterForm>(sitterToForm(sitter));
    const [errors, setErrors] = useState<Partial<Record<keyof SitterForm, string>>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validateSitterForm(form);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        setApiError(null);
        try {
            await updateSitter(sitter.id, {
                name: form.name.trim(),
                city: form.city.trim(),
                services: form.services,
                acceptedPetTypes: form.acceptedPetTypes,
                pricePerDay: Number(form.pricePerDay),
                description: form.description.trim(),
                rating: sitter.rating,
            });
            onUpdated();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscuta.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof SitterForm, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    return (
        <div className="sitterModalOverlay" onClick={onClose}>
            <div className="sitterModalBox" onClick={(e) => e.stopPropagation()}>
                <div className="sitterModalHeader">
                    <h2 className="sitterModalTitle">Editeaza profil sitter</h2>
                    <button className="sitterModalClose" onClick={onClose} aria-label="Inchide">×</button>
                </div>
                <SitterFormFields
                    form={form} errors={errors} loading={loading} apiError={apiError}
                    submitLabel="Salveaza modificarile"
                    onSubmit={handleSubmit} onChange={handleChange} onClose={onClose}
                />
            </div>
        </div>
    );
}

// ── Modal Confirmare Stergere ──────────────────────────────────────────────────
export function DeleteSitterConfirmModal({
    sitter,
    onClose,
    onDeleted,
}: {
    sitter: Sitter;
    onClose: () => void;
    onDeleted: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleDelete() {
        setLoading(true);
        setApiError(null);
        try {
            await deleteSitter(sitter.id);
            onDeleted();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscuta.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="sitterModalOverlay" onClick={onClose}>
            <div className="sitterModalBox" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
                <div className="sitterModalHeader">
                    <h2 className="sitterModalTitle">Sterge profil sitter</h2>
                    <button className="sitterModalClose" onClick={onClose} aria-label="Inchide">×</button>
                </div>
                <div style={{ padding: "8px 0 16px", textAlign: "center", color: "var(--color-text)" }}>
                    Esti sigur ca vrei sa stergi profilul <strong>{sitter.name}</strong>? Aceasta actiune nu poate fi anulata.
                </div>
                {apiError && <p className="sitterFieldError" style={{ textAlign: "center" }}>{apiError}</p>}
                <div className="sitterModalActions">
                    <AppButton variant="ghost" onClick={onClose} disabled={loading}>
                        Anuleaza
                    </AppButton>
                    <AppButton
                        variant="primary"
                        onClick={handleDelete}
                        disabled={loading}
                        style={{ borderColor: "#e53e3e", color: "#e53e3e" }}
                    >
                        {loading ? "Se sterge..." : "Da, sterge"}
                    </AppButton>
                </div>
            </div>
        </div>
    );
}

// ── Card Sitter ───────────────────────────────────────────────────────────────
export function SitterCard({
    s,
    onEdit,
    onDelete,
    onStartChat,
    onRated,
    startingChatSitterId,
}: {
    s: Sitter;
    onEdit: (s: Sitter) => void;
    onDelete: (s: Sitter) => void;
    onStartChat: (s: Sitter) => void;
    onRated: (rating: SitterRatingInfo) => void;
    startingChatSitterId: number | null;
}) {
    const { currentUser, isAdmin } = useAuth();
    const [ratingError, setRatingError] = useState<string | null>(null);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [savingRating, setSavingRating] = useState<number | null>(null);
    const [commentDraft, setCommentDraft] = useState("");
    const [commentTouched, setCommentTouched] = useState(false);
    const [reviewsOpen, setReviewsOpen] = useState(false);
    const [reviewsLoaded, setReviewsLoaded] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewsError, setReviewsError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<SitterReview[]>([]);

    const isStartingChat = startingChatSitterId === s.id;
    const isOwnSitterProfile = Boolean(currentUser && s.userId === currentUser.id);
    const isAdminUser = isAdmin();
    const canDeleteSitter = isOwnSitterProfile || isAdminUser;
    const isChatUnavailable = !s.userId || isOwnSitterProfile;
    const chatButtonLabel = isStartingChat
        ? "Se deschide..."
        : !s.userId
          ? "Indisponibil"
          : isOwnSitterProfile
            ? "Profilul tau"
            : "Scrie";
    const ratingCount = s.ratingCount ?? 0;
    const activeRating = selectedRating ?? 0;
    const ratingCountLabel = ratingCount === 1 ? "1 rating" : `${ratingCount} ratinguri`;
    const canRate = Boolean(currentUser) && !isOwnSitterProfile;
    const reviewCountLabel = reviewsLoaded ? reviews.length : ratingCount;

    function formatReviewDate(value: string) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "Recent";
        }

        return date.toLocaleDateString("ro-RO", { day: "2-digit", month: "short", year: "numeric" });
    }

    async function loadReviews() {
        try {
            setReviewsLoading(true);
            setReviewsError(null);
            const data = await getSitterReviews(s.id);
            setReviews(data);
            setReviewsLoaded(true);

            const myReview = currentUser ? data.find((review) => review.userId === currentUser.id) : null;
            if (myReview) {
                setSelectedRating(myReview.rating);
                setCommentDraft(myReview.comment ?? "");
                setCommentTouched(false);
            }
        } catch (err) {
            setReviewsError(err instanceof Error ? err.message : "Nu s-au putut incarca review-urile.");
        } finally {
            setReviewsLoading(false);
        }
    }

    function toggleReviews() {
        const nextOpen = !reviewsOpen;
        setReviewsOpen(nextOpen);
        if (nextOpen && !reviewsLoaded) {
            void loadReviews();
        }
    }

    async function saveReview(value: number, comment?: string) {
        if (!currentUser) {
            setRatingError("Autentifica-te ca sa poti lasa review.");
            return;
        }

        if (isOwnSitterProfile) {
            setRatingError("Nu poti evalua propriul profil.");
            return;
        }

        try {
            setSavingRating(value);
            setRatingError(null);
            const result = await rateSitter(s.id, value, comment);
            setSelectedRating(result.myRating);
            setCommentDraft(result.comment ?? comment ?? commentDraft);
            setCommentTouched(false);
            onRated(result);

            const hasSavedComment = Boolean((result.comment ?? comment ?? "").trim());
            if (reviewsOpen || hasSavedComment) {
                setReviewsOpen(true);
                await loadReviews();
            } else {
                setReviewsLoaded(false);
            }
        } catch (err) {
            setRatingError(err instanceof Error ? err.message : "Nu s-a putut salva review-ul.");
        } finally {
            setSavingRating(null);
        }
    }

    async function handleRate(value: number) {
        await saveReview(value, commentTouched ? commentDraft : undefined);
    }

    async function handleSaveComment() {
        if (!selectedRating) {
            setRatingError("Alege intai un rating.");
            return;
        }

        await saveReview(selectedRating, commentDraft);
    }

    return (
        <div className="sitter-card">
            <div className="rating">
                {s.rating > 0 ? `★ ${s.rating.toFixed(1)}` : "Nou"}
            </div>
            <button
                type="button"
                className={`sitterCommentsToggle${reviewsOpen ? " isActive" : ""}`}
                onClick={toggleReviews}
                aria-label={`Comentarii pentru ${s.name}`}
                title="Vezi comentariile"
            >
                <span>💬</span>
                <small>{reviewCountLabel}</small>
            </button>
            <h3>{s.name}</h3>
            <p className="city">{s.city}</p>
            <p><strong>Servicii:</strong> {s.services}</p>
            <p><strong>Animale acceptate:</strong> {s.acceptedPetTypes ?? "Orice"}</p>
            <p>{s.description}</p>
            <div className="sitterRatingPanel">
                <div className="sitterRatingSummary">
                    <span>{s.rating > 0 ? `${s.rating.toFixed(1)} / 5` : "Fara rating"}</span>
                    <small>{ratingCountLabel}</small>
                </div>
                <div className="sitterRatingStars" role="group" aria-label={`Rating pentru ${s.name}`}>
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            className={value <= activeRating ? "isActive" : undefined}
                            onClick={() => void handleRate(value)}
                            disabled={savingRating !== null || !canRate}
                            title={!currentUser ? "Autentifica-te ca sa poti da rating" : isOwnSitterProfile ? "Nu poti evalua propriul profil" : `${value} stele`}
                            aria-label={`${value} stele`}
                        >
                            {value <= activeRating ? "★" : "☆"}
                        </button>
                    ))}
                </div>
                <textarea
                    className="sitterCommentInput"
                    value={commentDraft}
                    onChange={(event) => {
                        setCommentDraft(event.target.value);
                        setCommentTouched(true);
                    }}
                    placeholder="Lasa un comentariu despre experienta..."
                    maxLength={700}
                    disabled={savingRating !== null || !canRate}
                />
                <div className="sitterReviewActions">
                    <small>{commentDraft.length}/700</small>
                    <button type="button" onClick={() => void handleSaveComment()} disabled={savingRating !== null || !canRate}>
                        Salveaza review
                    </button>
                </div>
                {savingRating !== null ? <small className="sitterRatingHint">Se salveaza...</small> : null}
                {ratingError ? <small className="sitterRatingError">{ratingError}</small> : null}
            </div>
            {reviewsOpen ? (
                <div className="sitterReviewsPanel">
                    <div className="sitterReviewsHeader">
                        <strong>Comentarii</strong>
                        <button type="button" onClick={() => void loadReviews()} disabled={reviewsLoading}>
                            Reincarca
                        </button>
                    </div>
                    {reviewsLoading ? <p>Se incarca review-urile...</p> : null}
                    {reviewsError ? <p className="sitterRatingError">{reviewsError}</p> : null}
                    {!reviewsLoading && !reviewsError && reviews.length === 0 ? (
                        <p>Nu exista comentarii pentru acest sitter.</p>
                    ) : null}
                    {!reviewsLoading && !reviewsError ? reviews.map((review) => (
                        <article className="sitterReviewItem" key={review.id}>
                            <div>
                                <strong>{review.userName || "Utilizator"}</strong>
                                <span>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                            </div>
                            <p>{review.comment || "Fara comentariu."}</p>
                            <small>{formatReviewDate(review.updatedAt)}</small>
                        </article>
                    )) : null}
                </div>
            ) : null}
            <div className="card-footer">
                <strong>{s.pricePerDay} MDL / zi</strong>
                <AppButton
                    type="button"
                    variant="primary"
                    onClick={() => onStartChat(s)}
                    disabled={isStartingChat || isChatUnavailable}
                    title={!s.userId ? "Profilul nu are cont asociat pentru chat" : isOwnSitterProfile ? "Acesta este profilul tau" : undefined}
                >
                    {chatButtonLabel}
                </AppButton>
            </div>
            {canDeleteSitter ? (
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    {isAdminUser ? (
                        <AppButton variant="ghost" size="sm" onClick={() => onEdit(s)}>
                            Editeaza
                        </AppButton>
                    ) : null}
                    <AppButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(s)}
                        style={{ borderColor: "#e53e3e", color: "#e53e3e" }}
                    >
                        Sterge
                    </AppButton>
                </div>
            ) : null}
        </div>
    );
}
