import { useEffect, useState } from "react";
import { AppButton } from "./AppButton";
import { FilterSelect } from "./FilterSelect";
import { getLostPets, createLostPet, updateLostPet, deleteLostPet, uploadLostPetImage, getLostPetImageUrl } from "../services/lostPetService";
import { useAuth } from "../context/AuthContext";
import type { LostPet } from "../services/lostPetService";

export { getLostPets };

const maxLostPetImageBytes = 2 * 1024 * 1024;
const allowedLostPetImageTypes = ["image/jpeg", "image/png", "image/webp"];

export interface LostPetForm {
    species: string;
    city: string;
    lostDate: string;
    contact: string;
    description: string;
    isFound: boolean;
}

export const emptyLostForm: LostPetForm = {
    species: "", city: "", lostDate: "", contact: "", description: "", isFound: false,
};

export function lostPetToForm(a: LostPet): LostPetForm {
    return {
        species: a.species,
        city: a.city,
        lostDate: a.lostDate,
        contact: a.contact,
        description: a.description ?? "",
        isFound: a.isFound,
    };
}

function validateLostForm(form: LostPetForm): Partial<Record<keyof LostPetForm, string>> {
    const e: Partial<Record<keyof LostPetForm, string>> = {};
    if (!form.species) e.species = "Selectează specia.";
    if (!form.city.trim()) e.city = "Orașul este obligatoriu.";
    if (!form.lostDate) e.lostDate = "Data este obligatorie.";
    if (!form.contact.trim()) e.contact = "Contactul este obligatoriu.";
    return e;
}

function validateLostPetImage(file: File | null) {
    if (!file) return "";
    if (!allowedLostPetImageTypes.includes(file.type)) {
        return "Alege o poza JPG, PNG sau WEBP.";
    }
    if (file.size > maxLostPetImageBytes) {
        return "Poza trebuie sa aiba maximum 2 MB.";
    }
    return "";
}

function LostPetFormFields({
    form, errors, loading, apiError, submitLabel, onSubmit, onChange, onClose, showIsFound,
    selectedImage, imagePreviewUrl, imageError, onImageChange,
}: {
    form: LostPetForm;
    errors: Partial<Record<keyof LostPetForm, string>>;
    loading: boolean;
    apiError: string | null;
    submitLabel: string;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (field: keyof LostPetForm, value: string | boolean) => void;
    onClose: () => void;
    showIsFound?: boolean;
    selectedImage?: File | null;
    imagePreviewUrl?: string;
    imageError?: string;
    onImageChange?: (file: File | null) => void;
}) {
    return (
        <form className="lostModalForm" onSubmit={onSubmit} noValidate>
            <div className="lostModalRow">
                <div className="lostModalField">
                    <label className="lostModalLabel">Specie *</label>
                    <FilterSelect
                        className={errors.species ? "fs-error" : ""}
                        value={form.species}
                        onChange={e => onChange("species", e.target.value)}
                    >
                        <option value="">Selectează specia</option>
                        <option value="Câine">Câine</option>
                        <option value="Pisică">Pisică</option>
                        <option value="Pasăre">Pasăre</option>
                        <option value="Rozător">Rozător</option>
                        <option value="Altul">Altul</option>
                    </FilterSelect>
                    {errors.species && <span className="lostFieldError">{errors.species}</span>}
                </div>
                <div className="lostModalField">
                    <label className="lostModalLabel">Oraș *</label>
                    <input
                        className={`lostModalInput${errors.city ? " lostInputError" : ""}`}
                        placeholder="ex. Chișinău"
                        value={form.city}
                        onChange={e => onChange("city", e.target.value)}
                    />
                    {errors.city && <span className="lostFieldError">{errors.city}</span>}
                </div>
            </div>

            <div className="lostModalRow">
                <div className="lostModalField">
                    <label className="lostModalLabel">Data pierderii *</label>
                    <input
                        type="date"
                        className={`lostModalInput${errors.lostDate ? " lostInputError" : ""}`}
                        value={form.lostDate}
                        onChange={e => onChange("lostDate", e.target.value)}
                    />
                    {errors.lostDate && <span className="lostFieldError">{errors.lostDate}</span>}
                </div>
                <div className="lostModalField">
                    <label className="lostModalLabel">Contact *</label>
                    <input
                        className={`lostModalInput${errors.contact ? " lostInputError" : ""}`}
                        placeholder="ex. +373 6xx xxx xxx"
                        value={form.contact}
                        onChange={e => onChange("contact", e.target.value)}
                    />
                    {errors.contact && <span className="lostFieldError">{errors.contact}</span>}
                </div>
            </div>

            <div className="lostModalField">
                <label className="lostModalLabel">Descriere</label>
                <textarea
                    className="lostModalTextarea"
                    placeholder="Descrie animalul: culoare, semne distinctive, zona unde a fost văzut ultima dată..."
                    value={form.description}
                    onChange={e => onChange("description", e.target.value)}
                    rows={3}
                />
            </div>

            {onImageChange && (
                <div className="lostModalField">
                    <label className="lostModalLabel">Poza animalului</label>
                    <label className="lostImagePicker">
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={e => onImageChange(e.target.files?.[0] ?? null)}
                        />
                        <span>{selectedImage ? selectedImage.name : "Alege poza"}</span>
                        <small>JPG, PNG sau WEBP, maximum 2 MB</small>
                    </label>
                    {imagePreviewUrl && (
                        <img className="lostImagePreview" src={imagePreviewUrl} alt="Previzualizare animal pierdut" />
                    )}
                    {imageError && <span className="lostFieldError">{imageError}</span>}
                </div>
            )}

            {showIsFound && (
                <div className="lostModalField">
                    <label className="lostModalCheckLabel">
                        <input
                            type="checkbox"
                            checked={form.isFound}
                            onChange={e => onChange("isFound", e.target.checked)}
                        />
                        Animalul a fost găsit
                    </label>
                </div>
            )}

            {apiError && <p className="lostFieldError" style={{ textAlign: "center" }}>{apiError}</p>}

            <div className="lostModalActions">
                <AppButton type="button" variant="ghost" onClick={onClose} disabled={loading}>
                    Anulează
                </AppButton>
                <AppButton type="submit" variant="primary" disabled={loading}>
                    {loading ? "Se salvează..." : submitLabel}
                </AppButton>
            </div>
        </form>
    );
}

export function AddLostPetModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
    const [form, setForm] = useState<LostPetForm>(emptyLostForm);
    const [errors, setErrors] = useState<Partial<Record<keyof LostPetForm, string>>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [imageError, setImageError] = useState("");

    useEffect(() => {
        if (!selectedImage) {
            setImagePreviewUrl("");
            return;
        }

        const previewUrl = URL.createObjectURL(selectedImage);
        setImagePreviewUrl(previewUrl);

        return () => URL.revokeObjectURL(previewUrl);
    }, [selectedImage]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validateLostForm(form);
        const selectedImageError = validateLostPetImage(selectedImage);
        setImageError(selectedImageError);
        if (Object.keys(errs).length > 0 || selectedImageError) { setErrors(errs); return; }
        setLoading(true);
        setApiError(null);
        try {
            const lostPetId = await createLostPet({
                species: form.species,
                city: form.city.trim(),
                lostDate: form.lostDate,
                contact: form.contact.trim(),
                description: form.description,
            });
            if (selectedImage) {
                await uploadLostPetImage(lostPetId, selectedImage);
            }
            onAdded();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscuta.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof LostPetForm, value: string | boolean) {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    function handleImageChange(file: File | null) {
        setSelectedImage(file);
        setImageError(validateLostPetImage(file));
    }

    return (
        <div className="lostModalOverlay" onClick={onClose}>
            <div className="lostModalBox" onClick={e => e.stopPropagation()}>
                <div className="lostModalHeader">
                    <h2 className="lostModalTitle">Adaugă anunț animal pierdut</h2>
                    <button className="lostModalClose" onClick={onClose} aria-label="Inchide">x</button>
                </div>
                <LostPetFormFields
                    form={form} errors={errors} loading={loading} apiError={apiError}
                    submitLabel="Adaugă anunț"
                    onSubmit={handleSubmit} onChange={handleChange} onClose={onClose}
                    selectedImage={selectedImage}
                    imagePreviewUrl={imagePreviewUrl}
                    imageError={imageError}
                    onImageChange={handleImageChange}
                />
            </div>
        </div>
    );
}

export function EditLostPetModal({ ad, onClose, onUpdated }: { ad: LostPet; onClose: () => void; onUpdated: () => void }) {
    const [form, setForm] = useState<LostPetForm>(lostPetToForm(ad));
    const [errors, setErrors] = useState<Partial<Record<keyof LostPetForm, string>>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(() => getLostPetImageUrl(ad.imageUrl));
    const [imageError, setImageError] = useState("");

    useEffect(() => {
        if (!selectedImage) {
            setImagePreviewUrl(getLostPetImageUrl(ad.imageUrl));
            return;
        }

        const previewUrl = URL.createObjectURL(selectedImage);
        setImagePreviewUrl(previewUrl);

        return () => URL.revokeObjectURL(previewUrl);
    }, [selectedImage, ad.imageUrl]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validateLostForm(form);
        const selectedImageError = validateLostPetImage(selectedImage);
        setImageError(selectedImageError);
        if (Object.keys(errs).length > 0 || selectedImageError) { setErrors(errs); return; }
        setLoading(true);
        setApiError(null);
        try {
            await updateLostPet(ad.id, {
                ...form,
                city: form.city.trim(),
                contact: form.contact.trim(),
            });
            if (selectedImage) {
                await uploadLostPetImage(ad.id, selectedImage);
            }
            onUpdated();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscuta.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof LostPetForm, value: string | boolean) {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    function handleImageChange(file: File | null) {
        setSelectedImage(file);
        setImageError(validateLostPetImage(file));
    }

    return (
        <div className="lostModalOverlay" onClick={onClose}>
            <div className="lostModalBox" onClick={e => e.stopPropagation()}>
                <div className="lostModalHeader">
                    <h2 className="lostModalTitle">Editează anunț</h2>
                    <button className="lostModalClose" onClick={onClose} aria-label="Inchide">x</button>
                </div>
                <LostPetFormFields
                    form={form} errors={errors} loading={loading} apiError={apiError}
                    submitLabel="Salvează modificările"
                    onSubmit={handleSubmit} onChange={handleChange} onClose={onClose}
                    showIsFound
                    selectedImage={selectedImage}
                    imagePreviewUrl={imagePreviewUrl}
                    imageError={imageError}
                    onImageChange={handleImageChange}
                />
            </div>
        </div>
    );
}

export function DeleteLostPetModal({ ad, onClose, onDeleted }: { ad: LostPet; onClose: () => void; onDeleted: () => void }) {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleDelete() {
        setLoading(true);
        setApiError(null);
        try {
            await deleteLostPet(ad.id);
            onDeleted();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscuta.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="lostModalOverlay" onClick={onClose}>
            <div className="lostModalBox" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                <div className="lostModalHeader">
                    <h2 className="lostModalTitle">Șterge anunț</h2>
                    <button className="lostModalClose" onClick={onClose} aria-label="Inchide">x</button>
                </div>
                <div style={{ padding: "8px 0 16px", textAlign: "center", color: "var(--color-text)" }}>
                    Ești sigur că vrei să ștergi anunțul pentru <strong>{ad.species}</strong> din <strong>{ad.city}</strong>? Această acțiune nu poate fi anulată.
                </div>
                {apiError && <p className="lostFieldError" style={{ textAlign: "center" }}>{apiError}</p>}
                <div className="lostModalActions">
                    <AppButton variant="ghost" onClick={onClose} disabled={loading}>
                        Anulează
                    </AppButton>
                    <AppButton
                        variant="primary"
                        onClick={handleDelete}
                        disabled={loading}
                        style={{ borderColor: "#e53e3e", color: "#e53e3e" }}
                    >
                        {loading ? "Se șterge..." : "Da, șterge"}
                    </AppButton>
                </div>
            </div>
        </div>
    );
}

export function LostPetCard({
    a, onEdit, onDelete,
}: {
    a: LostPet;
    onEdit: (a: LostPet) => void;
    onDelete: (a: LostPet) => void;
}) {
    const { currentUser, isAdmin } = useAuth();
    const canEdit = isAdmin();
    const canDelete = canEdit || (!!currentUser && a.userId === currentUser.id);
    const [imageFailed, setImageFailed] = useState(false);
    const imageSrc = imageFailed ? "" : getLostPetImageUrl(a.imageUrl);

    useEffect(() => {
        setImageFailed(false);
    }, [a.id, a.imageUrl]);

    return (
        <div className="lostCard">
            {imageSrc ? (
                <img className="lostCardImage" src={imageSrc} alt={`Poza animal pierdut ${a.species}`} loading="lazy" onError={() => setImageFailed(true)} />
            ) : (
                <div className="lostImagePlaceholder">
                    <span>{a.species}</span>
                    <small>Fara poza</small>
                </div>
            )}
            <div className="lostCardHeader">
                <span className="lostBadge">{a.species}</span>
                <span className="lostSmall">{a.city} - {a.lostDate}</span>
            </div>
            <p className="lostDesc">{a.description}</p>
            <div className="lostBadges">
                <span className="lostBadge">Contact: {a.contact}</span>
                {a.isFound && <span className="lostBadge" style={{ background: "#d1fae5", color: "#065f46" }}>Gasit</span>}
            </div>
            {(canEdit || canDelete) && (
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                    {canEdit && (
                        <AppButton variant="ghost" size="sm" onClick={() => onEdit(a)}>
                            Editeaza
                        </AppButton>
                    )}
                    {canDelete && (
                        <AppButton
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(a)}
                            style={{ borderColor: "#e53e3e", color: "#e53e3e" }}
                        >
                            Sterge
                        </AppButton>
                    )}
                </div>
            )}
        </div>
    );
}