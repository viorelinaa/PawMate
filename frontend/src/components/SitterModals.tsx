import { useState } from "react";
import { AppButton } from "./AppButton";
import { FilterSelect } from "./FilterSelect";
import { AdminOnly } from "./AdminOnly";
import {
    getSitters,
    createSitter,
    updateSitter,
    deleteSitter,
} from "../services/sitterService";
import type { Sitter } from "../services/sitterService";

export { getSitters };

// ── Tipuri formular ───────────────────────────────────────────────────────────
export interface SitterForm {
    name: string;
    city: string;
    services: string;
    pricePerDay: string;
    description: string;
}

export const emptySitterForm: SitterForm = {
    name: "",
    city: "",
    services: "",
    pricePerDay: "",
    description: "",
};

export function sitterToForm(s: Sitter): SitterForm {
    return {
        name: s.name,
        city: s.city,
        services: s.services,
        pricePerDay: String(s.pricePerDay),
        description: s.description ?? "",
    };
}

function validateSitterForm(form: SitterForm): Partial<Record<keyof SitterForm, string>> {
    const e: Partial<Record<keyof SitterForm, string>> = {};
    if (!form.name.trim()) e.name = "Numele este obligatoriu.";
    if (!form.city.trim()) e.city = "Orasul este obligatoriu.";
    if (!form.services) e.services = "Selecteaza tipul de serviciu.";
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
                    <input
                        className={`sitterModalInput${errors.city ? " sitterInputError" : ""}`}
                        placeholder="ex. Chisinau"
                        value={form.city}
                        onChange={(e) => onChange("city", e.target.value)}
                    />
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
                        <option value="Plimbari">Plimbari</option>
                        <option value="Ingrijire la domiciliu">Ingrijire la domiciliu</option>
                        <option value="Pet sitting">Pet sitting</option>
                        <option value="Hranire">Hranire</option>
                        <option value="Altul">Altul</option>
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
}: {
    s: Sitter;
    onEdit: (s: Sitter) => void;
    onDelete: (s: Sitter) => void;
}) {
    return (
        <div className="sitter-card">
            <div className="rating">
                {s.rating > 0 ? `⭐ ${s.rating.toFixed(1)}` : "Nou"}
            </div>
            <h3>{s.name}</h3>
            <p className="city">{s.city}</p>
            <p><strong>Servicii:</strong> {s.services}</p>
            <p>{s.description}</p>
            <div className="card-footer">
                <strong>{s.pricePerDay} MDL / zi</strong>
                <AppButton variant="primary">Rezerva</AppButton>
            </div>
            <AdminOnly>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <AppButton variant="ghost" size="sm" onClick={() => onEdit(s)}>
                        Editează
                    </AppButton>
                    <AppButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(s)}
                        style={{ borderColor: "#e53e3e", color: "#e53e3e" }}
                    >
                        Șterge
                    </AppButton>
                </div>
            </AdminOnly>
        </div>
    );
}
