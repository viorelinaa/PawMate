import { useState } from "react";
import { AppButton } from "./AppButton";
import { createDonationOrg, updateDonationOrg, deleteDonationOrg } from "../services/donationService";
import type { DonationOrg } from "../services/donationService";

export interface DonationOrgForm {
    name: string;
    city: string;
    type: string;
    donationLink: string;
    description: string;
}

const emptyForm: DonationOrgForm = {
    name: "",
    city: "",
    type: "ONG",
    donationLink: "",
    description: "",
};

function orgToForm(o: DonationOrg): DonationOrgForm {
    return {
        name: o.name,
        city: o.city,
        type: o.type,
        donationLink: o.donationLink,
        description: o.description,
    };
}

function validate(form: DonationOrgForm): Partial<Record<keyof DonationOrgForm, string>> {
    const e: Partial<Record<keyof DonationOrgForm, string>> = {};
    if (!form.name.trim()) e.name = "Numele este obligatoriu.";
    if (!form.description.trim()) e.description = "Descrierea este obligatorie.";
    if (!form.donationLink.trim()) {
        e.donationLink = "Link-ul de donație este obligatoriu.";
    } else {
        try { new URL(form.donationLink); } catch {
            e.donationLink = "Introduceți un URL valid (ex. https://...).";
        }
    }
    return e;
}

function DonationFormFields({
    form,
    errors,
    loading,
    apiError,
    submitLabel,
    onSubmit,
    onChange,
    onClose,
}: {
    form: DonationOrgForm;
    errors: Partial<Record<keyof DonationOrgForm, string>>;
    loading: boolean;
    apiError: string | null;
    submitLabel: string;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (field: keyof DonationOrgForm, value: string) => void;
    onClose: () => void;
}) {
    return (
        <form className="sitterModalForm" onSubmit={onSubmit} noValidate>
            <div className="sitterModalRow">
                <div className="sitterModalField">
                    <label className="sitterModalLabel">Nume *</label>
                    <input
                        className={`sitterModalInput${errors.name ? " sitterInputError" : ""}`}
                        placeholder="ex. Asociația AnimalSafe"
                        value={form.name}
                        onChange={(e) => onChange("name", e.target.value)}
                    />
                    {errors.name && <span className="sitterFieldError">{errors.name}</span>}
                </div>
                <div className="sitterModalField">
                    <label className="sitterModalLabel">Tip</label>
                    <select
                        className="sitterModalInput"
                        value={form.type}
                        onChange={(e) => onChange("type", e.target.value)}
                    >
                        <option value="ONG">ONG</option>
                        <option value="Adăpost">Adăpost</option>
                    </select>
                </div>
            </div>

            <div className="sitterModalRow">
                <div className="sitterModalField">
                    <label className="sitterModalLabel">Oraș</label>
                    <input
                        className="sitterModalInput"
                        placeholder="ex. Chișinău"
                        value={form.city}
                        onChange={(e) => onChange("city", e.target.value)}
                    />
                </div>
                <div className="sitterModalField">
                    <label className="sitterModalLabel">Link donație *</label>
                    <input
                        className={`sitterModalInput${errors.donationLink ? " sitterInputError" : ""}`}
                        placeholder="https://..."
                        value={form.donationLink}
                        onChange={(e) => onChange("donationLink", e.target.value)}
                    />
                    {errors.donationLink && <span className="sitterFieldError">{errors.donationLink}</span>}
                </div>
            </div>

            <div className="sitterModalField">
                <label className="sitterModalLabel">Descriere *</label>
                <textarea
                    className={`sitterModalTextarea${errors.description ? " sitterInputError" : ""}`}
                    placeholder="Descrie activitatea organizației..."
                    value={form.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    rows={3}
                />
                {errors.description && <span className="sitterFieldError">{errors.description}</span>}
            </div>

            {apiError && (
                <p className="sitterFieldError" style={{ textAlign: "center" }}>{apiError}</p>
            )}

            <div className="sitterModalActions">
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

// ── Modal Adăugare ────────────────────────────────────────────────────────────
export function AddDonationOrgModal({
    onClose,
    onAdded,
}: {
    onClose: () => void;
    onAdded: () => void;
}) {
    const [form, setForm] = useState<DonationOrgForm>(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<keyof DonationOrgForm, string>>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validate(form);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        setApiError(null);
        try {
            await createDonationOrg({
                name: form.name.trim(),
                city: form.city.trim(),
                type: form.type,
                donationLink: form.donationLink.trim(),
                description: form.description.trim(),
            });
            onAdded();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscută.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof DonationOrgForm, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    return (
        <div className="sitterModalOverlay" onClick={onClose}>
            <div className="sitterModalBox" onClick={(e) => e.stopPropagation()}>
                <div className="sitterModalHeader">
                    <h2 className="sitterModalTitle">Adaugă ONG / Adăpost</h2>
                    <button className="sitterModalClose" onClick={onClose} aria-label="Închide">×</button>
                </div>
                <DonationFormFields
                    form={form} errors={errors} loading={loading} apiError={apiError}
                    submitLabel="Adaugă ONG"
                    onSubmit={handleSubmit} onChange={handleChange} onClose={onClose}
                />
            </div>
        </div>
    );
}

// ── Modal Editare ─────────────────────────────────────────────────────────────
export function EditDonationOrgModal({
    org,
    onClose,
    onUpdated,
}: {
    org: DonationOrg;
    onClose: () => void;
    onUpdated: () => void;
}) {
    const [form, setForm] = useState<DonationOrgForm>(orgToForm(org));
    const [errors, setErrors] = useState<Partial<Record<keyof DonationOrgForm, string>>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validate(form);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        setApiError(null);
        try {
            await updateDonationOrg(org.id, {
                name: form.name.trim(),
                city: form.city.trim(),
                type: form.type,
                donationLink: form.donationLink.trim(),
                description: form.description.trim(),
            });
            onUpdated();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscută.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof DonationOrgForm, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    return (
        <div className="sitterModalOverlay" onClick={onClose}>
            <div className="sitterModalBox" onClick={(e) => e.stopPropagation()}>
                <div className="sitterModalHeader">
                    <h2 className="sitterModalTitle">Editează ONG / Adăpost</h2>
                    <button className="sitterModalClose" onClick={onClose} aria-label="Închide">×</button>
                </div>
                <DonationFormFields
                    form={form} errors={errors} loading={loading} apiError={apiError}
                    submitLabel="Salvează modificările"
                    onSubmit={handleSubmit} onChange={handleChange} onClose={onClose}
                />
            </div>
        </div>
    );
}

// ── Modal Confirmare Ștergere ──────────────────────────────────────────────────
export function DeleteDonationOrgModal({
    org,
    onClose,
    onDeleted,
}: {
    org: DonationOrg;
    onClose: () => void;
    onDeleted: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleDelete() {
        setLoading(true);
        setApiError(null);
        try {
            await deleteDonationOrg(org.id);
            onDeleted();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscută.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="sitterModalOverlay" onClick={onClose}>
            <div className="sitterModalBox" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
                <div className="sitterModalHeader">
                    <h2 className="sitterModalTitle">Șterge organizație</h2>
                    <button className="sitterModalClose" onClick={onClose} aria-label="Închide">×</button>
                </div>
                <div style={{ padding: "8px 0 16px", textAlign: "center", color: "var(--color-text)" }}>
                    Ești sigur că vrei să ștergi <strong>{org.name}</strong>? Această acțiune nu poate fi anulată.
                </div>
                {apiError && <p className="sitterFieldError" style={{ textAlign: "center" }}>{apiError}</p>}
                <div className="sitterModalActions">
                    <AppButton variant="ghost" onClick={onClose} disabled={loading}>
                        Anulează
                    </AppButton>
                    <AppButton
                        variant="ghost"
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
