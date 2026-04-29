import { useState } from "react";
import { AppButton } from "./AppButton";
import { AdminOnly } from "./AdminOnly";
import {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
} from "../services/eventService";
import type { EventItem } from "../services/eventService";

export { getEvents };

export interface EventForm {
    title: string;
    description: string;
    location: string;
    date: string;
}

export const emptyEventForm: EventForm = {
    title: "",
    description: "",
    location: "",
    date: "",
};

export function eventToForm(e: EventItem): EventForm {
    return {
        title: e.title,
        description: e.description ?? "",
        location: e.location,
        date: e.date.slice(0, 10),
    };
}

function validateEventForm(form: EventForm): Partial<Record<keyof EventForm, string>> {
    const e: Partial<Record<keyof EventForm, string>> = {};
    if (!form.title.trim()) e.title = "Titlul este obligatoriu.";
    if (!form.location.trim()) e.location = "Locația este obligatorie.";
    if (!form.date) e.date = "Data este obligatorie.";
    return e;
}

function EventFormFields({
    form,
    errors,
    loading,
    apiError,
    submitLabel,
    onSubmit,
    onChange,
    onClose,
}: {
    form: EventForm;
    errors: Partial<Record<keyof EventForm, string>>;
    loading: boolean;
    apiError: string | null;
    submitLabel: string;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (field: keyof EventForm, value: string) => void;
    onClose: () => void;
}) {
    return (
        <form className="sitterModalForm" onSubmit={onSubmit} noValidate>
            <div className="sitterModalRow">
                <div className="sitterModalField">
                    <label className="sitterModalLabel">Titlu eveniment *</label>
                    <input
                        className={`sitterModalInput${errors.title ? " sitterInputError" : ""}`}
                        placeholder="ex. Târg de adopții"
                        value={form.title}
                        onChange={(e) => onChange("title", e.target.value)}
                    />
                    {errors.title && <span className="sitterFieldError">{errors.title}</span>}
                </div>
                <div className="sitterModalField">
                    <label className="sitterModalLabel">Locație *</label>
                    <input
                        className={`sitterModalInput${errors.location ? " sitterInputError" : ""}`}
                        placeholder="ex. Chișinău"
                        value={form.location}
                        onChange={(e) => onChange("location", e.target.value)}
                    />
                    {errors.location && <span className="sitterFieldError">{errors.location}</span>}
                </div>
            </div>

            <div className="sitterModalRow">
                <div className="sitterModalField" style={{ flex: 1 }}>
                    <label className="sitterModalLabel">Data *</label>
                    <input
                        type="date"
                        className={`sitterModalInput${errors.date ? " sitterInputError" : ""}`}
                        value={form.date}
                        onChange={(e) => onChange("date", e.target.value)}
                    />
                    {errors.date && <span className="sitterFieldError">{errors.date}</span>}
                </div>
            </div>

            <div className="sitterModalField">
                <label className="sitterModalLabel">Descriere</label>
                <textarea
                    className="sitterModalTextarea"
                    placeholder="Descrie evenimentul: activități, program, detalii..."
                    value={form.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    rows={3}
                />
            </div>

            {apiError && <p className="sitterFieldError" style={{ textAlign: "center" }}>{apiError}</p>}

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
export function AddEventModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
    const [form, setForm] = useState<EventForm>(emptyEventForm);
    const [errors, setErrors] = useState<Partial<Record<keyof EventForm, string>>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validateEventForm(form);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        setApiError(null);
        try {
            await createEvent({
                title: form.title.trim(),
                description: form.description.trim(),
                location: form.location.trim(),
                date: new Date(form.date).toISOString(),
            });
            onAdded();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscută.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof EventForm, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    return (
        <div className="sitterModalOverlay" onClick={onClose}>
            <div className="sitterModalBox" onClick={(e) => e.stopPropagation()}>
                <div className="sitterModalHeader">
                    <h2 className="sitterModalTitle">Adaugă eveniment</h2>
                    <button className="sitterModalClose" onClick={onClose} aria-label="Închide">×</button>
                </div>
                <EventFormFields
                    form={form} errors={errors} loading={loading} apiError={apiError}
                    submitLabel="Adaugă eveniment"
                    onSubmit={handleSubmit} onChange={handleChange} onClose={onClose}
                />
            </div>
        </div>
    );
}

// ── Modal Editare ─────────────────────────────────────────────────────────────
export function EditEventModal({
    event,
    onClose,
    onUpdated,
}: {
    event: EventItem;
    onClose: () => void;
    onUpdated: () => void;
}) {
    const [form, setForm] = useState<EventForm>(eventToForm(event));
    const [errors, setErrors] = useState<Partial<Record<keyof EventForm, string>>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validateEventForm(form);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        setApiError(null);
        try {
            await updateEvent(event.id, {
                title: form.title.trim(),
                description: form.description.trim(),
                location: form.location.trim(),
                date: new Date(form.date).toISOString(),
            });
            onUpdated();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscută.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof EventForm, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    return (
        <div className="sitterModalOverlay" onClick={onClose}>
            <div className="sitterModalBox" onClick={(e) => e.stopPropagation()}>
                <div className="sitterModalHeader">
                    <h2 className="sitterModalTitle">Editează eveniment</h2>
                    <button className="sitterModalClose" onClick={onClose} aria-label="Închide">×</button>
                </div>
                <EventFormFields
                    form={form} errors={errors} loading={loading} apiError={apiError}
                    submitLabel="Salvează modificările"
                    onSubmit={handleSubmit} onChange={handleChange} onClose={onClose}
                />
            </div>
        </div>
    );
}

// ── Modal Confirmare Ștergere ──────────────────────────────────────────────────
export function DeleteEventModal({
    event,
    onClose,
    onDeleted,
}: {
    event: EventItem;
    onClose: () => void;
    onDeleted: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleDelete() {
        setLoading(true);
        setApiError(null);
        try {
            await deleteEvent(event.id);
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
                    <h2 className="sitterModalTitle">Șterge eveniment</h2>
                    <button className="sitterModalClose" onClick={onClose} aria-label="Închide">×</button>
                </div>
                <div style={{ padding: "8px 0 16px", textAlign: "center", color: "var(--color-text)" }}>
                    Ești sigur că vrei să ștergi <strong>{event.title}</strong>? Această acțiune nu poate fi anulată.
                </div>
                {apiError && <p className="sitterFieldError" style={{ textAlign: "center" }}>{apiError}</p>}
                <div className="sitterModalActions">
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

// ── Card Eveniment ─────────────────────────────────────────────────────────────
export function EventCard({
    event,
    onEdit,
    onDelete,
}: {
    event: EventItem;
    onEdit: (event: EventItem) => void;
    onDelete: (event: EventItem) => void;
}) {
    const dateLabel = event.date ? new Date(event.date).toLocaleDateString("ro-MD") : "";

    return (
        <article className="eventsCard">
            <div className="eventsCardTop">
                <span className="eventsCity">{event.location}</span>
                <span className="eventsDate">{dateLabel}</span>
            </div>
            <h3 className="eventsName">{event.title}</h3>
            <p className="eventsDesc">{event.description}</p>
            <AdminOnly>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <AppButton variant="ghost" size="sm" onClick={() => onEdit(event)}>
                        Editează
                    </AppButton>
                    <AppButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(event)}
                        style={{ borderColor: "#e53e3e", color: "#e53e3e" }}
                    >
                        Șterge
                    </AppButton>
                </div>
            </AdminOnly>
        </article>
    );
}
