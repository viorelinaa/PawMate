import { useState } from "react";
import { AppButton } from "./AppButton";
import {
    createVeterinaryClinic,
    deleteVeterinaryClinic,
    updateVeterinaryClinic,
    type VeterinaryClinic,
    type VeterinaryClinicCreatePayload,
} from "../services/veterinaryClinicService";

export interface VeterinaryClinicForm {
    name: string;
    city: string;
    address: string;
    phone: string;
    servicesText: string;
    emergency: boolean;
    description: string;
    googleMapsUrl: string;
    appleMapsUrl: string;
    mapEmbedUrl: string;
}

const emptyVeterinaryClinicForm: VeterinaryClinicForm = {
    name: "",
    city: "",
    address: "",
    phone: "",
    servicesText: "",
    emergency: false,
    description: "",
    googleMapsUrl: "",
    appleMapsUrl: "",
    mapEmbedUrl: "",
};

function validateVeterinaryClinicForm(form: VeterinaryClinicForm): Partial<Record<keyof VeterinaryClinicForm, string>> {
    const errors: Partial<Record<keyof VeterinaryClinicForm, string>> = {};

    if (!form.name.trim()) errors.name = "Numele clinicii este obligatoriu.";
    if (!form.city.trim()) errors.city = "Orașul este obligatoriu.";
    if (!form.address.trim() && !form.googleMapsUrl.trim() && !form.mapEmbedUrl.trim()) {
        errors.address = "Completează adresa sau un link exact de hartă.";
    }
    if (!form.phone.trim()) errors.phone = "Telefonul este obligatoriu.";
    if (parseServices(form.servicesText).length === 0) {
        errors.servicesText = "Adaugă cel puțin un serviciu.";
    }

    return errors;
}

function parseServices(value: string): string[] {
    return value
        .split(/[,\n;]/)
        .map((service) => service.trim())
        .filter(Boolean);
}

function extractIframeSrc(value: string) {
    const srcMatch = value.match(/src=["']([^"']+)["']/i);
    return (srcMatch?.[1] ?? value).trim().replace(/&amp;/g, "&");
}

function clinicToForm(clinic: VeterinaryClinic): VeterinaryClinicForm {
    return {
        name: clinic.name,
        city: clinic.city,
        address: clinic.address,
        phone: clinic.phone,
        servicesText: clinic.services.join(", "),
        emergency: clinic.emergency,
        description: clinic.description ?? "",
        googleMapsUrl: clinic.googleMapsUrl || clinic.mapEmbedUrl || "",
        appleMapsUrl: clinic.appleMapsUrl ?? "",
        mapEmbedUrl: "",
    };
}

function buildVeterinaryClinicPayload(form: VeterinaryClinicForm): VeterinaryClinicCreatePayload {
    return {
        name: form.name.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        services: parseServices(form.servicesText),
        emergency: form.emergency,
        description: form.description.trim(),
        googleMapsUrl: form.googleMapsUrl.trim(),
        appleMapsUrl: form.appleMapsUrl.trim(),
        mapEmbedUrl: extractIframeSrc(form.mapEmbedUrl),
    };
}

function VeterinaryClinicFormFields({
    form,
    errors,
    loading,
    apiError,
    submitLabel,
    onSubmit,
    onChange,
    onClose,
}: {
    form: VeterinaryClinicForm;
    errors: Partial<Record<keyof VeterinaryClinicForm, string>>;
    loading: boolean;
    apiError: string | null;
    submitLabel: string;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (field: keyof VeterinaryClinicForm, value: string | boolean) => void;
    onClose: () => void;
}) {
    return (
        <form className="vetClinicForm" onSubmit={onSubmit} noValidate>
            <div className="vetClinicRow">
                <div className="vetClinicField">
                    <label className="vetClinicLabel">Nume clinică *</label>
                    <input
                        className={`vetClinicInput${errors.name ? " vetClinicInputError" : ""}`}
                        value={form.name}
                        onChange={(e) => onChange("name", e.target.value)}
                        placeholder="ex. Clinica VetCare Centru"
                    />
                    {errors.name && <span className="vetClinicError">{errors.name}</span>}
                </div>
                <div className="vetClinicField">
                    <label className="vetClinicLabel">Oraș *</label>
                    <input
                        className={`vetClinicInput${errors.city ? " vetClinicInputError" : ""}`}
                        value={form.city}
                        onChange={(e) => onChange("city", e.target.value)}
                        placeholder="ex. Chișinău"
                    />
                    {errors.city && <span className="vetClinicError">{errors.city}</span>}
                </div>
            </div>

            <div className="vetClinicRow">
                <div className="vetClinicField">
                    <label className="vetClinicLabel">Adresă</label>
                    <input
                        className={`vetClinicInput${errors.address ? " vetClinicInputError" : ""}`}
                        value={form.address}
                        onChange={(e) => onChange("address", e.target.value)}
                        placeholder="opțională dacă pui un link exact de hartă"
                    />
                    {errors.address && <span className="vetClinicError">{errors.address}</span>}
                </div>
                <div className="vetClinicField">
                    <label className="vetClinicLabel">Telefon *</label>
                    <input
                        className={`vetClinicInput${errors.phone ? " vetClinicInputError" : ""}`}
                        value={form.phone}
                        onChange={(e) => onChange("phone", e.target.value)}
                        placeholder="ex. 022 123 456"
                    />
                    {errors.phone && <span className="vetClinicError">{errors.phone}</span>}
                </div>
            </div>

            <div className="vetClinicField">
                <label className="vetClinicLabel">Servicii *</label>
                <input
                    className={`vetClinicInput${errors.servicesText ? " vetClinicInputError" : ""}`}
                    value={form.servicesText}
                    onChange={(e) => onChange("servicesText", e.target.value)}
                    placeholder="Consultații, Vaccinări, Chirurgie"
                />
                {errors.servicesText && <span className="vetClinicError">{errors.servicesText}</span>}
            </div>

            <div className="vetClinicRow">
                <div className="vetClinicField">
                    <label className="vetClinicLabel">Google Maps URL</label>
                    <input
                        className="vetClinicInput"
                        value={form.googleMapsUrl}
                        onChange={(e) => onChange("googleMapsUrl", e.target.value)}
                        placeholder="https://maps.app.goo.gl/..."
                    />
                </div>
                <div className="vetClinicField">
                    <label className="vetClinicLabel">Apple Maps URL</label>
                    <input
                        className="vetClinicInput"
                        value={form.appleMapsUrl}
                        onChange={(e) => onChange("appleMapsUrl", e.target.value)}
                        placeholder="https://maps.apple.com/?..."
                    />
                </div>
            </div>

            <div className="vetClinicField">
                <label className="vetClinicLabel">Harta din site URL</label>
                <input
                    className="vetClinicInput"
                    value={form.mapEmbedUrl}
                    onChange={(e) => onChange("mapEmbedUrl", e.target.value)}
                    placeholder="lipește Google Maps Embed URL sau codul iframe"
                />
            </div>

            <div className="vetClinicField">
                <label className="vetClinicCheckbox">
                    <input
                        type="checkbox"
                        checked={form.emergency}
                        onChange={(e) => onChange("emergency", e.target.checked)}
                    />
                    Oferă urgențe 24/7
                </label>
            </div>

            <div className="vetClinicField">
                <label className="vetClinicLabel">Descriere</label>
                <textarea
                    className="vetClinicTextarea"
                    value={form.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    placeholder="Detalii despre clinică, echipă și tipurile de consultații."
                    rows={4}
                />
            </div>

            {apiError && <p className="vetClinicError vetClinicErrorBlock">{apiError}</p>}

            <div className="vetClinicActions">
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

export function AddVeterinaryClinicModal({
    onClose,
    onAdded,
}: {
    onClose: () => void;
    onAdded: () => void | Promise<void>;
}) {
    const [form, setForm] = useState<VeterinaryClinicForm>(emptyVeterinaryClinicForm);
    const [errors, setErrors] = useState<Partial<Record<keyof VeterinaryClinicForm, string>>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const validationErrors = validateVeterinaryClinicForm(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setApiError(null);
        try {
            await createVeterinaryClinic(buildVeterinaryClinicPayload(form));
            await onAdded();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscută.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof VeterinaryClinicForm, value: string | boolean) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalBox vetFormModal" onClick={(e) => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2 className="modalTitle">Adaugă clinică veterinară</h2>
                    <button type="button" className="modalClose" onClick={onClose} aria-label="Închide formularul">
                        ✕
                    </button>
                </div>

                <VeterinaryClinicFormFields
                    form={form}
                    errors={errors}
                    loading={loading}
                    apiError={apiError}
                    submitLabel="Adaugă clinică"
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                    onClose={onClose}
                />
            </div>
        </div>
    );
}

export function EditVeterinaryClinicModal({
    clinic,
    onClose,
    onUpdated,
}: {
    clinic: VeterinaryClinic;
    onClose: () => void;
    onUpdated: (clinic: VeterinaryClinic) => void | Promise<void>;
}) {
    const [form, setForm] = useState<VeterinaryClinicForm>(() => clinicToForm(clinic));
    const [errors, setErrors] = useState<Partial<Record<keyof VeterinaryClinicForm, string>>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const validationErrors = validateVeterinaryClinicForm(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setApiError(null);
        try {
            const updatedClinic = await updateVeterinaryClinic(clinic.id, buildVeterinaryClinicPayload(form));
            await onUpdated(updatedClinic);
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscută.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof VeterinaryClinicForm, value: string | boolean) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalBox vetFormModal" onClick={(e) => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2 className="modalTitle">Editează clinică veterinară</h2>
                    <button type="button" className="modalClose" onClick={onClose} aria-label="Închide formularul">
                        ✕
                    </button>
                </div>

                <VeterinaryClinicFormFields
                    form={form}
                    errors={errors}
                    loading={loading}
                    apiError={apiError}
                    submitLabel="Salvează modificările"
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                    onClose={onClose}
                />
            </div>
        </div>
    );
}

export function DeleteVeterinaryClinicConfirmModal({
    clinic,
    onClose,
    onDeleted,
}: {
    clinic: VeterinaryClinic;
    onClose: () => void;
    onDeleted: () => void | Promise<void>;
}) {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleDelete() {
        setLoading(true);
        setApiError(null);
        try {
            await deleteVeterinaryClinic(clinic.id);
            await onDeleted();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscută.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalBox vetDeleteModal" onClick={(e) => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2 className="modalTitle">Șterge clinică</h2>
                    <button type="button" className="modalClose" onClick={onClose} aria-label="Închide confirmarea">
                        ✕
                    </button>
                </div>

                <p className="vetDeleteText">
                    Ești sigur că vrei să ștergi clinica <strong>{clinic.name}</strong>?
                </p>

                {apiError && <p className="vetClinicError vetClinicErrorBlock">{apiError}</p>}

                <div className="vetClinicActions">
                    <AppButton type="button" variant="ghost" onClick={onClose} disabled={loading}>
                        Anulează
                    </AppButton>
                    <AppButton
                        type="button"
                        variant="primary"
                        onClick={handleDelete}
                        disabled={loading}
                        style={{ borderColor: "var(--color-danger-border)", color: "var(--color-danger)" }}
                    >
                        {loading ? "Se șterge..." : "Șterge clinica"}
                    </AppButton>
                </div>
            </div>
        </div>
    );
}
