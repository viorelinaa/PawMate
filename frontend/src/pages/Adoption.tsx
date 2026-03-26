import { useState } from "react";
import "../styles/Adoption.css";
import { UserOnly } from "../components/UserOnly";
import { SearchIcon } from "../components/SearchIcon";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";
import { FilterSelect } from "../components/FilterSelect";

interface AddPetForm {
    name: string;
    species: string;
    city: string;
    age: string;
    size: string;
    vaccinated: boolean;
    sterilized: boolean;
    description: string;
}

const emptyForm: AddPetForm = {
    name: "", species: "", city: "", age: "", size: "",
    vaccinated: false, sterilized: false, description: "",
};

function AddPetModal({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState<AddPetForm>(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<keyof AddPetForm, string>>>({});

    function validate() {
        const e: Partial<Record<keyof AddPetForm, string>> = {};
        if (!form.name.trim()) e.name = "Numele este obligatoriu.";
        if (!form.species) e.species = "Selectează specia.";
        if (!form.city.trim()) e.city = "Orașul este obligatoriu.";
        if (!form.age) e.age = "Selectează vârsta.";
        if (!form.size) e.size = "Selectează talia.";
        return e;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        // TODO: connect to backend
        alert("Animalul a fost adăugat cu succes! (mock)");
        onClose();
    }

    function set(field: keyof AddPetForm, value: string | boolean) {
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
                <form className="modalForm" onSubmit={handleSubmit} noValidate>
                    <div className="modalRow">
                        <div className="modalField">
                            <label className="modalLabel">Nume animal *</label>
                            <input
                                className={`modalInput${errors.name ? " inputError" : ""}`}
                                placeholder="ex. Buddy"
                                value={form.name}
                                onChange={e => set("name", e.target.value)}
                            />
                            {errors.name && <span className="fieldError">{errors.name}</span>}
                        </div>
                        <div className="modalField">
                            <label className="modalLabel">Tip / Specie *</label>
                            <FilterSelect
                                className={errors.species ? "fs-error" : ""}
                                value={form.species}
                                onChange={e => set("species", e.target.value)}
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
                                onChange={e => set("city", e.target.value)}
                            />
                            {errors.city && <span className="fieldError">{errors.city}</span>}
                        </div>
                        <div className="modalField">
                            <label className="modalLabel">Vârstă *</label>
                            <FilterSelect
                                className={errors.age ? "fs-error" : ""}
                                value={form.age}
                                onChange={e => set("age", e.target.value)}
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
                                onChange={e => set("size", e.target.value)}
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
                                    onChange={e => set("vaccinated", e.target.checked)}
                                />
                                Vaccinat
                            </label>
                            <label className="modalCheckLabel">
                                <input
                                    type="checkbox"
                                    checked={form.sterilized}
                                    onChange={e => set("sterilized", e.target.checked)}
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
                            onChange={e => set("description", e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="modalActions">
                        <AppButton type="button" variant="ghost" onClick={onClose}>
                            Anulează
                        </AppButton>
                        <AppButton type="submit" variant="primary">
                            Adaugă animal
                        </AppButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface Pet {
    id: string;
    name: string;
    species: string;
    age: string;
    size: string;
    city: string;
    vaccinated: boolean;
    sterilized: boolean;
    description: string;
}

const adoptionPets: Pet[] = [
    {
        id: "a1", name: "Luna", species: "Pisică", age: "Adult", size: "Mic",
        city: "Chișinău", vaccinated: true, sterilized: true,
        description: "Pisică blândă, obișnuită cu apartamentul.",
    },
    {
        id: "a2", name: "Max", species: "Câine", age: "Pui", size: "Mediu",
        city: "Bălți", vaccinated: true, sterilized: false,
        description: "Energic, învață rapid comenzile de bază.",
    },
    {
        id: "a3", name: "Mimi", species: "Pisică", age: "Senior", size: "Mic",
        city: "Chișinău", vaccinated: false, sterilized: true,
        description: "Foarte calmă, potrivită pentru o casă liniștită.",
    },
];

const allCities = [...new Set(adoptionPets.map((p) => p.city))];

function PetCard({ p }: { p: Pet }) {
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
            <AppButton className="btnDetails" variant="primary" onClick={() => alert("Cerere trimisă (mock)!")}>
                Cere detalii
            </AppButton>
        </div>
    );
}

export default function Adoption() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [query, setQuery] = useState("");
    const [city, setCity] = useState("ALL");
    const [species, setSpecies] = useState("ALL");
    const [age, setAge] = useState("ALL");
    const [size, setSize] = useState("ALL");
    const [onlyVacc, setOnlyVacc] = useState(false);
    const [onlySter, setOnlySter] = useState(false);

    const filtered = adoptionPets.filter((p) => {
        if (city !== "ALL" && p.city !== city) return false;
        if (species !== "ALL" && p.species !== species) return false;
        if (age !== "ALL" && p.age !== age) return false;
        if (size !== "ALL" && p.size !== size) return false;
        if (onlyVacc && !p.vaccinated) return false;
        if (onlySter && !p.sterilized) return false;
        if (query) {
            const q = query.toLowerCase();
            if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q))
                return false;
        }
        return true;
    });

    function resetFilters() {
        setQuery("");
        setCity("ALL");
        setSpecies("ALL");
        setAge("ALL");
        setSize("ALL");
        setOnlyVacc(false);
        setOnlySter(false);
    }

    return (
        <div>
            <section className="adoptionHero">
                <div className="adoptionCloud ac1" />
                <div className="adoptionCloud ac2" />
                <span className="adoptionPaw ap1">🐾</span>
                <span className="adoptionPaw ap2">🐾</span>
                <span className="adoptionPaw ap3">🐾</span>
                <span
                    className="adoptionPaw"
                    style={{ top: "32px", left: "140px", transform: "rotate(8deg)", fontSize: "20px" }}
                >
                    🐾
                </span>
                <span
                    className="adoptionPaw"
                    style={{ bottom: "80px", right: "140px", transform: "rotate(-12deg)", fontSize: "22px" }}
                >
                    🐾
                </span>
                <div className="adoptionHeroInner">
                    <h1 className="adoptionTitle heroTitle">Adopție</h1>
                    <p className="adoptionSub heroSubtitle">Filtrează și găsește animalul potrivit.</p>
                </div>
            </section>

            <UserOnly>
                <div className="roleActionBar">
                    <AddActionButton
                        label="Adaugă animal pentru adopție"
                        onClick={() => setShowAddModal(true)}
                    />
                </div>
            </UserOnly>

            {showAddModal && <AddPetModal onClose={() => setShowAddModal(false)} />}

            <div className="adoptionContent">
            <div className="filters">
                <div className="filtersGrid">
                    <div className="searchField">
                        <SearchIcon size={18} aria-hidden="true" />
                        <input
                            className="filterInput"
                            placeholder="Caută după nume/descriere..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <FilterSelect className="filterSelect" value={city} onChange={(e) => setCity(e.target.value)}>
                        <option value="ALL">Toate orașele</option>
                        {allCities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </FilterSelect>
                    <FilterSelect className="filterSelect" value={species} onChange={(e) => setSpecies(e.target.value)}>
                        <option value="ALL">Toate speciile</option>
                        <option value="Câine">Câine</option>
                        <option value="Pisică">Pisică</option>
                        <option value="Pasăre">Pasăre</option>
                        <option value="Rozător">Rozător</option>
                        <option value="Altul">Altul</option>
                    </FilterSelect>
                    <AppButton className="btnReset" variant="ghost" onClick={resetFilters}>
                        Reset filtre
                    </AppButton>

                    <FilterSelect className="filterSelect" value={age} onChange={(e) => setAge(e.target.value)}>
                        <option value="ALL">Toate vârstele</option>
                        <option value="Pui">Pui</option>
                        <option value="Adult">Adult</option>
                        <option value="Senior">Senior</option>
                    </FilterSelect>
                    <FilterSelect className="filterSelect" value={size} onChange={(e) => setSize(e.target.value)}>
                        <option value="ALL">Toate taliile</option>
                        <option value="Mic">Mic</option>
                        <option value="Mediu">Mediu</option>
                        <option value="Mare">Mare</option>
                    </FilterSelect>
                    <label className="filterCheck">
                        <input type="checkbox" checked={onlyVacc} onChange={(e) => setOnlyVacc(e.target.checked)} />
                        Vaccinat
                    </label>
                    <label className="filterCheck">
                        <input type="checkbox" checked={onlySter} onChange={(e) => setOnlySter(e.target.checked)} />
                        Sterilizat
                    </label>
                </div>
            </div>

            {filtered.length > 0 ? (
                <div className="petCards">
                    {filtered.map((p) => (
                        <PetCard key={p.id} p={p} />
                    ))}
                </div>
            ) : (
                <div className="emptyNotice">Nu există rezultate pentru filtrele selectate.</div>
            )}
            </div>
        </div>
    );
}
