import { useState, type FocusEvent } from "react";
import "../styles/petSitting.css";
import { UserOnly } from "../components/UserOnly";
import { SearchIcon } from "../components/SearchIcon";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";
import { FilterSelect } from "../components/FilterSelect";

interface AddSitterForm {
    name: string;
    city: string;
    services: string;
    pricePerDay: string;
    description: string;
}

const emptySitterForm: AddSitterForm = {
    name: "", city: "", services: "", pricePerDay: "", description: "",
};

function AddSitterModal({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState<AddSitterForm>(emptySitterForm);
    const [errors, setErrors] = useState<Partial<Record<keyof AddSitterForm, string>>>({});

    function validate() {
        const e: Partial<Record<keyof AddSitterForm, string>> = {};
        if (!form.name.trim()) e.name = "Numele este obligatoriu.";
        if (!form.city.trim()) e.city = "Orașul este obligatoriu.";
        if (!form.services) e.services = "Selectează tipul de serviciu.";
        if (!form.pricePerDay.trim()) e.pricePerDay = "Prețul este obligatoriu.";
        else if (isNaN(Number(form.pricePerDay)) || Number(form.pricePerDay) <= 0)
            e.pricePerDay = "Introdu un preț valid.";
        return e;
    }

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        alert("Profilul sitter a fost adăugat cu succes! (mock)");
        onClose();
    }

    function set(field: keyof AddSitterForm, value: string) {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    return (
        <div className="sitterModalOverlay" onClick={onClose}>
            <div className="sitterModalBox" onClick={e => e.stopPropagation()}>
                <div className="sitterModalHeader">
                    <h2 className="sitterModalTitle">Adaugă profil sitter</h2>
                    <button className="sitterModalClose" onClick={onClose} aria-label="Închide">✕</button>
                </div>
                <form className="sitterModalForm" onSubmit={handleSubmit} noValidate>
                    <div className="sitterModalRow">
                        <div className="sitterModalField">
                            <label className="sitterModalLabel">Nume *</label>
                            <input
                                className={`sitterModalInput${errors.name ? " sitterInputError" : ""}`}
                                placeholder="ex. Ana"
                                value={form.name}
                                onChange={e => set("name", e.target.value)}
                            />
                            {errors.name && <span className="sitterFieldError">{errors.name}</span>}
                        </div>
                        <div className="sitterModalField">
                            <label className="sitterModalLabel">Oraș *</label>
                            <input
                                className={`sitterModalInput${errors.city ? " sitterInputError" : ""}`}
                                placeholder="ex. Chișinău"
                                value={form.city}
                                onChange={e => set("city", e.target.value)}
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
                                onChange={e => set("services", e.target.value)}
                            >
                                <option value="">Selectează serviciul</option>
                                <option value="Plimbări">Plimbări</option>
                                <option value="Îngrijire la domiciliu">Îngrijire la domiciliu</option>
                                <option value="Pet sitting">Pet sitting</option>
                                <option value="Hrănire">Hrănire</option>
                                <option value="Altul">Altul</option>
                            </FilterSelect>
                            {errors.services && <span className="sitterFieldError">{errors.services}</span>}
                        </div>
                        <div className="sitterModalField">
                            <label className="sitterModalLabel">Preț / zi (MDL) *</label>
                            <input
                                type="number"
                                min="1"
                                className={`sitterModalInput${errors.pricePerDay ? " sitterInputError" : ""}`}
                                placeholder="ex. 250"
                                value={form.pricePerDay}
                                onChange={e => set("pricePerDay", e.target.value)}
                            />
                            {errors.pricePerDay && <span className="sitterFieldError">{errors.pricePerDay}</span>}
                        </div>
                    </div>

                    <div className="sitterModalField">
                        <label className="sitterModalLabel">Descriere</label>
                        <textarea
                            className="sitterModalTextarea"
                            placeholder="Descrie experiența, animalele acceptate, programul disponibil..."
                            value={form.description}
                            onChange={e => set("description", e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="sitterModalActions">
                        <AppButton type="button" variant="ghost" onClick={onClose}>
                            Anulează
                        </AppButton>
                        <AppButton type="submit" variant="primary">
                            Adaugă profil
                        </AppButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

type Sitter = {
    id: number;
    name: string;
    city: string;
    desc: string;
    pricePerDay: number;
    rating: number;
};

const SITERS: Sitter[] = [
    { id: 1, name: "Ana",    city: "Chișinău", desc: "Plimbări + îngrijire la domiciliu.",       pricePerDay: 250, rating: 4.8 },
    { id: 2, name: "Mihai",  city: "Bălți",    desc: "Pet sitting pentru pisici și câini mici.", pricePerDay: 180, rating: 4.6 },
    { id: 3, name: "Irina",  city: "Chișinău", desc: "Îngrijire full-time, experiență 3 ani.",   pricePerDay: 300, rating: 4.9 },
    { id: 4, name: "Victor", city: "Cahul",    desc: "Plimbări zilnice și hrănire.",              pricePerDay: 150, rating: 4.4 },
    { id: 5, name: "Elena",  city: "Orhei",    desc: "Pet sitting la domiciliu.",                 pricePerDay: 200, rating: 4.7 },
];

function SitterCard({ s }: { s: Sitter }) {
    return (
        <div className="sitter-card">
            <div className="rating">⭐ {s.rating}</div>
            <h3>{s.name}</h3>
            <p className="city">{s.city}</p>
            <p>{s.desc}</p>
            <div className="card-footer">
                <strong>{s.pricePerDay} MDL / zi</strong>
                <AppButton variant="primary">Rezervă</AppButton>
            </div>
        </div>
    );
}

export default function SittersList() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [query, setQuery] = useState("");
    const [onlyTopRated, setOnlyTopRated] = useState(false);
    const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");
    const [priceMenuOpen, setPriceMenuOpen] = useState(false);
    const ratingThreshold = 4.7;

    const handlePriceMenuBlur = (event: FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setPriceMenuOpen(false);
        }
    };

    const filtered = SITERS.filter((s) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q);
    });

    const rated = onlyTopRated
        ? filtered.filter((s) => s.rating >= ratingThreshold)
        : filtered;

    const sorted = [...rated].sort((a, b) => {
        if (priceSort === "asc") return a.pricePerDay - b.pricePerDay;
        if (priceSort === "desc") return b.pricePerDay - a.pricePerDay;
        return 0;
    });

    const priceLabel =
        priceSort === "asc" ? "Preț / zi ↑" : priceSort === "desc" ? "Preț / zi ↓" : "Preț / zi";
    const ratingLabel = `⭐ rating ${ratingThreshold}+`;

    return (
        <div className="pet-sitting-page">

            {/* ── Hero ── */}
            <div className="sitters-hero">
                {/* Nori */}
                <div className="sitterCloud sc1" />
                <div className="sitterCloud sc2" />

                {/* Lăbuțe */}
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
                    <p className="subtitle heroSubtitle">Caută îngrijitori pentru animalul tău de companie.</p>
                </div>
            </div>

            <UserOnly>
                <div className="roleActionBar">
                    <AddActionButton
                        label="Adaugă profil sitter"
                        onClick={() => setShowAddModal(true)}
                    />
                </div>
            </UserOnly>

            {showAddModal && <AddSitterModal onClose={() => setShowAddModal(false)} />}

            {/* ── Content ── */}
            <div className="sitters-content">

                {/* Filtre */}
                <div className="filters">
                    <div className="searchField">
                        <SearchIcon size={18} aria-hidden="true" />
                        <input
                            type="text"
                            placeholder="Caută după nume sau oraș..."
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
                            setOnlyTopRated(false);
                            setPriceSort("none");
                            setPriceMenuOpen(false);
                        }}
                    >
                        Reset
                    </AppButton>
                    <AppButton
                        type="button"
                        variant={onlyTopRated ? "primary" : "ghost"}
                        className="filter-rating filter-btn"
                        aria-pressed={onlyTopRated}
                        onClick={() => setOnlyTopRated((prev) => !prev)}
                    >
                        {ratingLabel}
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
                                    Fără sortare
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
                                    Crescător
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
                                    Descrescător
                                </AppButton>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Cards */}
                <div className="sitters-grid">
                    {sorted.map((s) => (
                        <SitterCard key={s.id} s={s} />
                    ))}
                </div>

            </div>
        </div>
    );
}
