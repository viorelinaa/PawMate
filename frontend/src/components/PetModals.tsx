import { useState } from "react";
import { AppButton } from "./AppButton";
import { FilterSelect } from "./FilterSelect";
import { AdminOnly } from "./AdminOnly";
import { getPets, createPet, updatePet, deletePet } from "../services/petService";
import type { Pet } from "../services/petService";

export interface PetForm {
    name: string;
    species: string;
    city: string;
    age: string;
    size: string;
    vaccinated: boolean;
    sterilized: boolean;
    description: string;
}

export const emptyForm: PetForm = {
    name: "", species: "", city: "", age: "", size: "",
    vaccinated: false, sterilized: false, description: "",
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
    };
}

export { getPets };

// ── Formular comun ────────────────────────────────────────────────────────────
export function PetFormFields({
    form, errors, loading, apiError, submitLabel, onSubmit, onChange, onClose,
}: {
    form: PetForm;
    errors: Partial<Record<keyof PetForm, string>>;
    loading: boolean;
    apiError: string | null;
    submitLabel: string;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (field: keyof PetForm, value: string | boolean) => void;
    onClose: () => void;
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
    return e;
}

// ── Modal Adăugare ────────────────────────────────────────────────────────────
export function AddPetModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
    const [form, setForm] = useState<PetForm>(emptyForm);
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
            await createPet(form);
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

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalBox" onClick={e => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2 className="modalTitle">Adaugă animal pentru adopție</h2>
                    <button className="modalClose" onClick={onClose} aria-label="Închide">✕</button>
                </div>
                <PetFormFields
                    form={form} errors={errors} loading={loading} apiError={apiError}
                    submitLabel="Adaugă animal"
                    onSubmit={handleSubmit} onChange={handleChange} onClose={onClose}
                />
            </div>
        </div>
    );
}

// ── Modal Editare ─────────────────────────────────────────────────────────────
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
            await updatePet(pet.id, form);
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
                    <button className="modalClose" onClick={onClose} aria-label="Închide">✕</button>
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

// ── Modal Confirmare Ștergere ─────────────────────────────────────────────────
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
                    <button className="modalClose" onClick={onClose} aria-label="Închide">✕</button>
                </div>
                <div style={{ padding: "8px 0 16px", textAlign: "center", color: "var(--color-text)" }}>
                    Ești sigur că vrei să ștergi <strong>{pet.name}</strong>? Această acțiune nu poate fi anulată.
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

// ── Card Animal ───────────────────────────────────────────────────────────────
export function PetCard({ p, onEdit, onDelete }: { p: Pet; onEdit: (p: Pet) => void; onDelete: (p: Pet) => void }) {
    return (
        <div className="petCard">
            <div className="petCardHeader">
                <div>
                    <h3 className="petName">{p.name}</h3>
                    <span className="petCity">{p.city}</span>
                </div>
                <span className="badge">{p.species}</span>
            </div>
            <div className="badges">
                <span className="badge">{p.age}</span>
                <span className="badge">{p.size}</span>
                <span className="badge">{p.vaccinated ? "Vaccinat" : "Nevaccinat"}</span>
                <span className="badge">{p.sterilized ? "Sterilizat" : "Nesterilizat"}</span>
            </div>
            <p className="petDesc">{p.description}</p>
            <div className="petCardActions" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <AppButton className="btnDetails" variant="primary" onClick={() => alert("Cerere trimisă (mock)!")}>
                    Cere detalii
                </AppButton>
                <AdminOnly>
                    <AppButton variant="ghost" size="sm" onClick={() => onEdit(p)}>
                        Editează
                    </AppButton>
                    <AppButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(p)}
                        style={{ borderColor: "#e53e3e", color: "#e53e3e" }}
                    >
                        Șterge
                    </AppButton>
                </AdminOnly>
            </div>
        </div>
    );
}
