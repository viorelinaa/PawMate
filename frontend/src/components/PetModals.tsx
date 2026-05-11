import { useEffect, useState } from "react";
import { AppButton } from "./AppButton";
import { FilterSelect } from "./FilterSelect";
import { getPets, createPet, updatePet, deletePet, uploadPetImage, getPetImageUrl } from "../services/petService";
import { useAuth } from "../context/AuthContext";
import type { Pet } from "../services/petService";

const maxPetImageBytes = 2 * 1024 * 1024;
const allowedPetImageTypes = ["image/jpeg", "image/png", "image/webp"];

export interface PetForm {
    name: string;
    species: string;
    city: string;
    age: string;
    size: string;
    vaccinated: boolean;
    sterilized: boolean;
    description: string;
    ownerContact: string;
}

export const emptyForm: PetForm = {
    name: "",
    species: "",
    city: "",
    age: "",
    size: "",
    vaccinated: false,
    sterilized: false,
    description: "",
    ownerContact: "",
};

export function petToForm(p: Pet): PetForm {
    return {
        name: p.name,
        species: p.species,
        city: p.city,
        age: p.age,
        size: p.size,
        vaccinated: p.vaccinated,
        sterilized: p.sterilized,
        description: p.description ?? "",
        ownerContact: p.ownerContact ?? "",
    };
}

export { getPets };

function normalizePetLabel(value: string) {
    const labels: Record<string, string> = {
        Caine: "Câine",
        Pisica: "Pisică",
        Pasare: "Pasăre",
        Rozator: "Rozător",
        "CÄƒine": "Câine",
        "CĂ˘ine": "Câine",
        "PisicÄ": "Pisică",
        "PasÄre": "Pasăre",
        "RozÄtor": "Rozător",
    };

    return labels[value] ?? value;
}

function validatePetImage(file: File | null) {
    if (!file) return "";
    if (!allowedPetImageTypes.includes(file.type)) {
        return "Alege o imagine JPG, PNG sau WEBP.";
    }
    if (file.size > maxPetImageBytes) {
        return "Imaginea trebuie să aibă maximum 2 MB.";
    }
    return "";
}

export function PetFormFields({
    form, errors, loading, apiError, submitLabel, onSubmit, onChange, onClose,
    selectedImage, imagePreviewUrl, imageError, onImageChange,
}: {
    form: PetForm;
    errors: Partial<Record<keyof PetForm, string>>;
    loading: boolean;
    apiError: string | null;
    submitLabel: string;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (field: keyof PetForm, value: string | boolean) => void;
    onClose: () => void;
    selectedImage?: File | null;
    imagePreviewUrl?: string;
    imageError?: string;
    onImageChange?: (file: File | null) => void;
}) {
    return (
        <form className="modalForm" onSubmit={onSubmit} noValidate>
            <div className="modalRow">
                <div className="modalField">
                    <label className="modalLabel">Nume animal *</label>
                    <input
                        className={`modalInput${errors.name ? " inputError" : ""}`}
                        placeholder="ex. Buddy"
                        value={form.name}
                        onChange={e => onChange("name", e.target.value)}
                    />
                    {errors.name && <span className="fieldError">{errors.name}</span>}
                </div>
                <div className="modalField">
                    <label className="modalLabel">Tip / Specie *</label>
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
                    {errors.species && <span className="fieldError">{errors.species}</span>}
                </div>
            </div>

            <div className="modalRow">
                <div className="modalField">
                    <label className="modalLabel">Oraș *</label>
                    <input
                        className={`modalInput${errors.city ? " inputError" : ""}`}
                        placeholder="ex. Chișinău"
                        value={form.city}
                        onChange={e => onChange("city", e.target.value)}
                    />
                    {errors.city && <span className="fieldError">{errors.city}</span>}
                </div>
                <div className="modalField">
                    <label className="modalLabel">Vârstă *</label>
                    <FilterSelect
                        className={errors.age ? "fs-error" : ""}
                        value={form.age}
                        onChange={e => onChange("age", e.target.value)}
                    >
                        <option value="">Selectează vârsta</option>
                        <option value="Pui">Pui</option>
                        <option value="Adult">Adult</option>
                        <option value="Senior">Senior</option>
                    </FilterSelect>
                    {errors.age && <span className="fieldError">{errors.age}</span>}
                </div>
            </div>

            <div className="modalRow">
                <div className="modalField">
                    <label className="modalLabel">Talie *</label>
                    <FilterSelect
                        className={errors.size ? "fs-error" : ""}
                        value={form.size}
                        onChange={e => onChange("size", e.target.value)}
                    >
                        <option value="">Selectează talia</option>
                        <option value="Mic">Mic</option>
                        <option value="Mediu">Mediu</option>
                        <option value="Mare">Mare</option>
                    </FilterSelect>
                    {errors.size && <span className="fieldError">{errors.size}</span>}
                </div>
                <div className="modalField modalCheckboxes">
                    <label className="modalCheckLabel">
                        <input
                            type="checkbox"
                            checked={form.vaccinated}
                            onChange={e => onChange("vaccinated", e.target.checked)}
                        />
                        Vaccinat
                    </label>
                    <label className="modalCheckLabel">
                        <input
                            type="checkbox"
                            checked={form.sterilized}
                            onChange={e => onChange("sterilized", e.target.checked)}
                        />
                        Sterilizat
                    </label>
                </div>
            </div>

            <div className="modalField">
                <label className="modalLabel">Descriere</label>
                <textarea
                    className="modalTextarea"
                    placeholder="Descrie comportamentul, nevoile sau alte detalii..."
                    value={form.description}
                    onChange={e => onChange("description", e.target.value)}
                    rows={3}
                />
            </div>

            <div className="modalField">
                <label className="modalLabel">Contact proprietar *</label>
                <input
                    className={`modalInput${errors.ownerContact ? " inputError" : ""}`}
                    placeholder="ex. +373 6xx xxx xxx sau email"
                    value={form.ownerContact}
                    onChange={e => onChange("ownerContact", e.target.value)}
                />
                {errors.ownerContact && <span className="fieldError">{errors.ownerContact}</span>}
            </div>

            {onImageChange && (
                <div className="modalField">
                    <label className="modalLabel">Poza animalului</label>
                    <label className="petImagePicker">
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={e => onImageChange(e.target.files?.[0] ?? null)}
                        />
                        <span>{selectedImage ? selectedImage.name : "Alege imaginea"}</span>
                        <small>JPG, PNG sau WEBP, maximum 2 MB</small>
                    </label>
                    {imagePreviewUrl && (
                        <img className="petImagePreview" src={imagePreviewUrl} alt="Previzualizare animal" />
                    )}
                    {imageError && <span className="fieldError">{imageError}</span>}
                </div>
            )}

            {apiError && <p className="fieldError" style={{ textAlign: "center" }}>{apiError}</p>}

            <div className="modalActions">
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

function validatePetForm(form: PetForm): Partial<Record<keyof PetForm, string>> {
    const e: Partial<Record<keyof PetForm, string>> = {};
    if (!form.name.trim()) e.name = "Numele este obligatoriu.";
    if (!form.species) e.species = "Selectează specia.";
    if (!form.city.trim()) e.city = "Orașul este obligatoriu.";
    if (!form.age) e.age = "Selectează vârsta.";
    if (!form.size) e.size = "Selectează talia.";
    if (!form.ownerContact.trim()) e.ownerContact = "Contactul proprietarului este obligatoriu.";
    return e;
}

export function AddPetModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
    const [form, setForm] = useState<PetForm>(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<keyof PetForm, string>>>({});
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
        const errs = validatePetForm(form);
        const selectedImageError = validatePetImage(selectedImage);
        setImageError(selectedImageError);
        if (Object.keys(errs).length > 0 || selectedImageError) { setErrors(errs); return; }
        setLoading(true);
        setApiError(null);
        try {
            const petId = await createPet({ ...form, ownerContact: form.ownerContact.trim() });
            if (selectedImage) {
                await uploadPetImage(petId, selectedImage);
            }
            onAdded();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscută.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof PetForm, value: string | boolean) {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    function handleImageChange(file: File | null) {
        setSelectedImage(file);
        setImageError(validatePetImage(file));
    }

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalBox" onClick={e => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2 className="modalTitle">Adaugă animal pentru adopție</h2>
                    <button className="modalClose" onClick={onClose} aria-label="Închide">x</button>
                </div>
                <PetFormFields
                    form={form} errors={errors} loading={loading} apiError={apiError}
                    submitLabel="Adaugă animal"
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

export function EditPetModal({ pet, onClose, onUpdated }: { pet: Pet; onClose: () => void; onUpdated: () => void }) {
    const [form, setForm] = useState<PetForm>(petToForm(pet));
    const [errors, setErrors] = useState<Partial<Record<keyof PetForm, string>>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validatePetForm(form);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        setApiError(null);
        try {
            await updatePet(pet.id, { ...form, ownerContact: form.ownerContact.trim() });
            onUpdated();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscută.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof PetForm, value: string | boolean) {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalBox" onClick={e => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2 className="modalTitle">Editează animal</h2>
                    <button className="modalClose" onClick={onClose} aria-label="Închide">x</button>
                </div>
                <PetFormFields
                    form={form} errors={errors} loading={loading} apiError={apiError}
                    submitLabel="Salvează modificările"
                    onSubmit={handleSubmit} onChange={handleChange} onClose={onClose}
                />
            </div>
        </div>
    );
}

export function DeleteConfirmModal({ pet, onClose, onDeleted }: { pet: Pet; onClose: () => void; onDeleted: () => void }) {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleDelete() {
        setLoading(true);
        setApiError(null);
        try {
            await deletePet(pet.id);
            onDeleted();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscută.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalBox" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2 className="modalTitle">Șterge animal</h2>
                    <button className="modalClose" onClick={onClose} aria-label="Închide">x</button>
                </div>
                <div style={{ padding: "8px 0 16px", textAlign: "center", color: "var(--color-text)" }}>
                    Ești sigură că vrei să ștergi <strong>{pet.name}</strong>? Această acțiune nu poate fi anulată.
                </div>
                {apiError && <p className="fieldError" style={{ textAlign: "center" }}>{apiError}</p>}
                <div className="modalActions">
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

export function PetCard({ p, onEdit, onDelete }: { p: Pet; onEdit: (p: Pet) => void; onDelete: (p: Pet) => void }) {
    const { currentUser, isAdmin } = useAuth();
    const canEdit = isAdmin();
    const canDelete = canEdit || (!!currentUser && p.userId === currentUser.id);
    const [imageFailed, setImageFailed] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const imageSrc = imageFailed ? "" : getPetImageUrl(p.imageUrl);
    const speciesLabel = normalizePetLabel(p.species);
    const ownerContact = p.ownerContact?.trim();

    useEffect(() => {
        setImageFailed(false);
        setShowContact(false);
    }, [p.id, p.imageUrl]);

    return (
        <div className="petCard">
            {imageSrc ? (
                <img className="petImage" src={imageSrc} alt={`Poză cu ${p.name}`} loading="lazy" onError={() => setImageFailed(true)} />
            ) : (
                <div className="petImagePlaceholder">
                    <span>{speciesLabel}</span>
                    <small>Fără poză</small>
                </div>
            )}
            <div className="petCardHeader">
                <div>
                    <h3 className="petName">{p.name}</h3>
                    <span className="petCity">{p.city}</span>
                </div>
                <span className="badge">{speciesLabel}</span>
            </div>
            <div className="badges">
                <span className="badge">{p.age}</span>
                <span className="badge">{p.size}</span>
                <span className="badge">{p.vaccinated ? "Vaccinat" : "Nevaccinat"}</span>
                <span className="badge">{p.sterilized ? "Sterilizat" : "Nesterilizat"}</span>
            </div>
            <p className="petDesc">{p.description}</p>
            <div className="petCardActions" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <AppButton className="btnDetails" variant="primary" onClick={() => setShowContact(prev => !prev)}>
                    {showContact ? "Ascunde detalii" : "Cere detalii"}
                </AppButton>
                {showContact && (
                    <div className="petContactBox">
                        <span>Contact proprietar</span>
                        <strong>{ownerContact || "Contact indisponibil"}</strong>
                    </div>
                )}
                {canEdit && (
                    <AppButton variant="ghost" size="sm" onClick={() => onEdit(p)}>
                        Editează
                    </AppButton>
                )}
                {canDelete && (
                    <AppButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(p)}
                        style={{ borderColor: "#e53e3e", color: "#e53e3e" }}
                    >
                        Șterge
                    </AppButton>
                )}
            </div>
        </div>
    );
}