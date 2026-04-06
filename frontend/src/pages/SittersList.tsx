import { useEffect, useState, type FocusEvent, type FormEvent } from "react";
import "../styles/petSitting.css";
import { UserOnly } from "../components/UserOnly";
import { SearchIcon } from "../components/SearchIcon";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";
import { FilterSelect } from "../components/FilterSelect";
import { createSitter, getSitters, type Sitter } from "../services/sitterService";

interface AddSitterForm {
    name: string;
    city: string;
    services: string;
    pricePerDay: string;
    description: string;
}

const emptySitterForm: AddSitterForm = {
    name: "",
    city: "",
    services: "",
    pricePerDay: "",
    description: "",
};

function AddSitterModal({
    onClose,
    onAdded,
}: {
    onClose: () => void;
    onAdded: () => Promise<void> | void;
}) {
    const [form, setForm] = useState<AddSitterForm>(emptySitterForm);
    const [errors, setErrors] = useState<Partial<Record<keyof AddSitterForm, string>>>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function validate() {
        const e: Partial<Record<keyof AddSitterForm, string>> = {};

        if (!form.name.trim()) e.name = "Numele este obligatoriu.";
        if (!form.city.trim()) e.city = "Orasul este obligatoriu.";
        if (!form.services) e.services = "Selecteaza tipul de serviciu.";
        if (!form.pricePerDay.trim()) e.pricePerDay = "Pretul este obligatoriu.";
        else if (isNaN(Number(form.pricePerDay)) || Number(form.pricePerDay) <= 0) {
            e.pricePerDay = "Introdu un pret valid.";
        }

        return e;
    }

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError(null);

            await createSitter({
                name: form.name.trim(),
                city: form.city.trim(),
                services: form.services,
                pricePerDay: Number(form.pricePerDay),
                description: form.description.trim(),
            });

            await onAdded();
            onClose();
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "A aparut o eroare la salvarea profilului."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function set(field: keyof AddSitterForm, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
        setSubmitError(null);
    }

    return (
        <div className="sitterModalOverlay" onClick={onClose}>
            <div className="sitterModalBox" onClick={(e) => e.stopPropagation()}>
                <div className="sitterModalHeader">
                    <h2 className="sitterModalTitle">Adauga profil sitter</h2>
                    <button className="sitterModalClose" onClick={onClose} aria-label="Inchide">
                        ×
                    </button>
                </div>

                <form className="sitterModalForm" onSubmit={handleSubmit} noValidate>
                    <div className="sitterModalRow">
                        <div className="sitterModalField">
                            <label className="sitterModalLabel">Nume *</label>
                            <input
                                className={`sitterModalInput${errors.name ? " sitterInputError" : ""}`}
                                placeholder="ex. Ana"
                                value={form.name}
                                onChange={(e) => set("name", e.target.value)}
                            />
                            {errors.name && <span className="sitterFieldError">{errors.name}</span>}
                        </div>

                        <div className="sitterModalField">
                            <label className="sitterModalLabel">Oras *</label>
                            <input
                                className={`sitterModalInput${errors.city ? " sitterInputError" : ""}`}
                                placeholder="ex. Chisinau"
                                value={form.city}
                                onChange={(e) => set("city", e.target.value)}
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
                                onChange={(e) => set("services", e.target.value)}
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
                                onChange={(e) => set("pricePerDay", e.target.value)}
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
                            onChange={(e) => set("description", e.target.value)}
                            rows={3}
                        />
                    </div>

                    {submitError && <div className="sitterFieldError">{submitError}</div>}

                    <div className="sitterModalActions">
                        <AppButton type="button" variant="ghost" onClick={onClose}>
                            Anuleaza
                        </AppButton>
                        <AppButton type="submit" variant="primary">
                            {isSubmitting ? "Se salveaza..." : "Adauga profil"}
                        </AppButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
function SitterCard({ s }: { s: Sitter }) {
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
        </div>
    );
}
export default function SittersList() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [sitters, setSitters] = useState<Sitter[]>([]);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");
    const [priceMenuOpen, setPriceMenuOpen] = useState(false);

    async function loadSitters() {
        try {
            setIsLoading(true);
            const data = await getSitters();
            setSitters(data);
            setLoadError(null);
        } catch (error) {
            setLoadError(
                error instanceof Error
                    ? error.message
                    : "Nu s-au putut incarca sitterii."
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void loadSitters();
    }, []);

    const handlePriceMenuBlur = (event: FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setPriceMenuOpen(false);
        }
    };

    const filtered = sitters.filter((s) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;

        return (
            s.name.toLowerCase().includes(q) ||
            s.city.toLowerCase().includes(q) ||
            s.services.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q)
        );
    });

    const sorted = [...filtered].sort((a, b) => {
        if (priceSort === "asc") return a.pricePerDay - b.pricePerDay;
        if (priceSort === "desc") return b.pricePerDay - a.pricePerDay;
        return 0;
    });

    const priceLabel =
        priceSort === "asc"
            ? "Pret / zi ↑"
            : priceSort === "desc"
              ? "Pret / zi ↓"
              : "Pret / zi";

    return (
        <div className="pet-sitting-page">
            <div className="sitters-hero">
                <div className="sitterCloud sc1" />
                <div className="sitterCloud sc2" />

                <span className="sitterPaw sp1">🐾</span>
                <span className="sitterPaw sp2">🐾</span>
                <span className="sitterPaw sp3">🐾</span>
                <span
                    className="sitterPaw"
                    style={{ top: "30px", left: "130px", transform: "rotate(10deg)", fontSize: "20px" }}
                >
                    🐾
                </span>
                <span
                    className="sitterPaw"
                    style={{ bottom: "78px", right: "130px", transform: "rotate(-12deg)", fontSize: "22px" }}
                >
                    🐾
                </span>

                <div className="heroInner">
                    <h1 className="heroTitle">Pet Sitting</h1>
                    <p className="subtitle heroSubtitle">
                        Cauta ingrijitori pentru animalul tau de companie.
                    </p>
                </div>
            </div>

            <UserOnly>
                <div className="roleActionBar">
                    <AddActionButton
                        label="Adauga profil sitter"
                        onClick={() => setShowAddModal(true)}
                    />
                </div>
            </UserOnly>

            {showAddModal && (
                <AddSitterModal
                    onClose={() => setShowAddModal(false)}
                    onAdded={loadSitters}
                />
            )}

            <div className="sitters-content">
                <div className="filters">
                    <div className="searchField">
                        <SearchIcon size={18} aria-hidden="true" />
                        <input
                            type="text"
                            placeholder="Cauta dupa nume, oras, servicii..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    <AppButton
                        type="button"
                        variant="ghost"
                        className="filter-reset filter-btn"
                        onClick={() => {
                            setQuery("");
                            setPriceSort("none");
                            setPriceMenuOpen(false);
                        }}
                    >
                        Reset
                    </AppButton>

                    <div
                        className="filter-dropdown"
                        onBlur={handlePriceMenuBlur}
                        onKeyDown={(event) => {
                            if (event.key === "Escape") {
                                setPriceMenuOpen(false);
                            }
                        }}
                    >
                        <AppButton
                            type="button"
                            variant={priceSort !== "none" ? "primary" : "ghost"}
                            className="filter-price filter-btn"
                            aria-pressed={priceSort !== "none"}
                            aria-haspopup="menu"
                            aria-expanded={priceMenuOpen}
                            onClick={() => setPriceMenuOpen((prev) => !prev)}
                        >
                            {priceLabel}
                        </AppButton>

                        {priceMenuOpen ? (
                            <div className="filter-menu" role="menu">
                                <AppButton
                                    type="button"
                                    variant={priceSort === "none" ? "primary" : "ghost"}
                                    onClick={() => {
                                        setPriceSort("none");
                                        setPriceMenuOpen(false);
                                    }}
                                    role="menuitem"
                                >
                                    Fara sortare
                                </AppButton>
                                <AppButton
                                    type="button"
                                    variant={priceSort === "asc" ? "primary" : "ghost"}
                                    onClick={() => {
                                        setPriceSort("asc");
                                        setPriceMenuOpen(false);
                                    }}
                                    role="menuitem"
                                >
                                    Crescator
                                </AppButton>
                                <AppButton
                                    type="button"
                                    variant={priceSort === "desc" ? "primary" : "ghost"}
                                    onClick={() => {
                                        setPriceSort("desc");
                                        setPriceMenuOpen(false);
                                    }}
                                    role="menuitem"
                                >
                                    Descrescator
                                </AppButton>
                            </div>
                        ) : null}
                    </div>
                </div>

                {isLoading && <div className="lostEmpty">Se incarca sitterii...</div>}
                {loadError && <div className="lostEmpty" style={{ color: "red" }}>{loadError}</div>}

                {!isLoading && !loadError && sorted.length === 0 && (
                    <div className="lostEmpty">Nu exista rezultate pentru filtrele selectate.</div>
                )}

                {!isLoading && !loadError && sorted.length > 0 && (
                    <div className="sitters-grid">
                        {sorted.map((s) => (
                            <SitterCard key={s.id} s={s} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
