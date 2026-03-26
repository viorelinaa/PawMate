import { useState } from "react";
import "../styles/LostPets.css";
import { UserOnly } from "../components/UserOnly";
import { SearchIcon } from "../components/SearchIcon";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";
import { FilterSelect } from "../components/FilterSelect";

interface AddLostForm {
    species: string;
    city: string;
    date: string;
    contact: string;
    description: string;
}

const emptyLostForm: AddLostForm = {
    species: "", city: "", date: "", contact: "", description: "",
};

function AddLostModal({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState<AddLostForm>(emptyLostForm);
    const [errors, setErrors] = useState<Partial<Record<keyof AddLostForm, string>>>({});

    function validate() {
        const e: Partial<Record<keyof AddLostForm, string>> = {};
        if (!form.species) e.species = "Selectează specia.";
        if (!form.city.trim()) e.city = "Orașul este obligatoriu.";
        if (!form.date) e.date = "Data este obligatorie.";
        if (!form.contact.trim()) e.contact = "Contactul este obligatoriu.";
        return e;
    }

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        alert("Anunțul a fost adăugat cu succes! (mock)");
        onClose();
    }

    function set(field: keyof AddLostForm, value: string) {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    return (
        <div className="lostModalOverlay" onClick={onClose}>
            <div className="lostModalBox" onClick={e => e.stopPropagation()}>
                <div className="lostModalHeader">
                    <h2 className="lostModalTitle">Adaugă anunț animal pierdut</h2>
                    <button className="lostModalClose" onClick={onClose} aria-label="Închide">✕</button>
                </div>
                <form className="lostModalForm" onSubmit={handleSubmit} noValidate>
                    <div className="lostModalRow">
                        <div className="lostModalField">
                            <label className="lostModalLabel">Specie *</label>
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
                            {errors.species && <span className="lostFieldError">{errors.species}</span>}
                        </div>
                        <div className="lostModalField">
                            <label className="lostModalLabel">Oraș *</label>
                            <input
                                className={`lostModalInput${errors.city ? " lostInputError" : ""}`}
                                placeholder="ex. Chișinău"
                                value={form.city}
                                onChange={e => set("city", e.target.value)}
                            />
                            {errors.city && <span className="lostFieldError">{errors.city}</span>}
                        </div>
                    </div>

                    <div className="lostModalRow">
                        <div className="lostModalField">
                            <label className="lostModalLabel">Data pierderii *</label>
                            <input
                                type="date"
                                className={`lostModalInput${errors.date ? " lostInputError" : ""}`}
                                value={form.date}
                                onChange={e => set("date", e.target.value)}
                            />
                            {errors.date && <span className="lostFieldError">{errors.date}</span>}
                        </div>
                        <div className="lostModalField">
                            <label className="lostModalLabel">Contact *</label>
                            <input
                                className={`lostModalInput${errors.contact ? " lostInputError" : ""}`}
                                placeholder="ex. +373 6xx xxx xxx"
                                value={form.contact}
                                onChange={e => set("contact", e.target.value)}
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
                            onChange={e => set("description", e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="lostModalActions">
                        <AppButton type="button" variant="ghost" onClick={onClose}>
                            Anulează
                        </AppButton>
                        <AppButton type="submit" variant="primary">
                            Adaugă anunț
                        </AppButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface LostAd {
    id: string;
    species: string;
    city: string;
    date: string;
    contact: string;
    description: string;
}

const lostAds: LostAd[] = [
    {
        id: "l1", species: "Câine", city: "Chișinău", date: "2026-02-01",
        contact: "+373 6xx xxx xxx",
        description: "Câine bej, zgardă albastră, pierdut în zona Botanica.",
    },
    {
        id: "l2", species: "Pisică", city: "Bălți", date: "2026-01-29",
        contact: "+373 7xx xxx xxx",
        description: "Pisică tigrată, foarte sperioasă, răspunde la Mura.",
    },
    {
        id: "l3", species: "Câine", city: "Chișinău", date: "2026-02-05",
        contact: "+373 6xx xxx xxx",
        description: "Câine negru de talie mare, foarte prietenos, pierdut lângă parcul central.",
    },
    {
        id: "l4", species: "Pasăre", city: "Orhei", date: "2026-02-08",
        contact: "+373 6xx xxx xxx",
        description: "Papagal verde cu inel albastru, zboară spre zona centru.",
    },
    {
        id: "l5", species: "Rozător", city: "Cahul", date: "2026-02-10",
        contact: "+373 7xx xxx xxx",
        description: "Iepuraș alb cu pete gri, a ieșit din curte în dimineața de vineri.",
    },
    {
        id: "l6", species: "Altul", city: "Ungheni", date: "2026-02-11",
        contact: "+373 6xx xxx xxx",
        description: "Broască țestoasă mică, carapace verde-olive, dispărută din balcon.",
    },
    {
        id: "l7", species: "Pisică", city: "Soroca", date: "2026-02-12",
        contact: "+373 7xx xxx xxx",
        description: "Pisică albă cu coadă neagră, poartă medalion roșu.",
    },
    {
        id: "l8", species: "Câine", city: "Bălți", date: "2026-02-13",
        contact: "+373 6xx xxx xxx",
        description: "Câine mic, rasa bichon, zgardă roz, dispărut în zona gară.",
    },
    {
        id: "l9", species: "Pasăre", city: "Chișinău", date: "2026-02-14",
        contact: "+373 7xx xxx xxx",
        description: "Canar galben, foarte vocal, poate fi speriat de zgomote.",
    },
    {
        id: "l10", species: "Rozător", city: "Comrat", date: "2026-02-15",
        contact: "+373 6xx xxx xxx",
        description: "Porcușor de Guineea maro, poartă zgardă mică verde.",
    },
];

function LostPetCard({ a }: { a: LostAd }) {
    return (
        <div className="lostCard">
            <div className="lostCardHeader">
                <span className="lostBadge">{a.species}</span>
                <span className="lostSmall">{a.city} • {a.date}</span>
            </div>
            <p className="lostDesc">{a.description}</p>
            <div className="lostBadges">
                <span className="lostBadge">Contact: {a.contact}</span>
            </div>
        </div>
    );
}

export default function LostPets() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [query, setQuery] = useState("");
    const [species, setSpecies] = useState("ALL");
    const [city, setCity] = useState("ALL");

    const allCities = [...new Set(lostAds.map((a) => a.city))];

    const filtered = lostAds.filter((a) => {
        if (species !== "ALL" && a.species !== species) return false;
        if (city !== "ALL" && a.city !== city) return false;
        if (query) {
            const q = query.toLowerCase();
            if (!a.description.toLowerCase().includes(q)) return false;
        }
        return true;
    });

    function resetFilters() {
        setQuery("");
        setSpecies("ALL");
        setCity("ALL");
    }

    return (
        <div>
            <section className="lostHero">
                <div className="lostCloud lc1" />
                <div className="lostCloud lc2" />
                <span className="lostPaw lp1">🐾</span>
                <span className="lostPaw lp2">🐾</span>
                <span className="lostPaw lp3">🐾</span>
                <span
                    className="lostPaw"
                    style={{ top: "30px", left: "120px", transform: "rotate(14deg)", fontSize: "20px" }}
                >
                    🐾
                </span>
                <span
                    className="lostPaw"
                    style={{ bottom: "70px", right: "120px", transform: "rotate(-10deg)", fontSize: "22px" }}
                >
                    🐾
                </span>
                <div className="lostHeroInner">
                    <h1 className="lostTitle heroTitle">Animale pierdute</h1>
                    <p className="lostSub heroSubtitle">Caută în anunțuri și ajută la găsirea lor.</p>
                </div>
            </section>

            <UserOnly>
                <div className="roleActionBar">
                    <AddActionButton
                        label="Adaugă anunț animal pierdut"
                        onClick={() => setShowAddModal(true)}
                    />
                </div>
            </UserOnly>

            {showAddModal && <AddLostModal onClose={() => setShowAddModal(false)} />}

            <div className="lostContent">
                <div className="lostFilters">
                    <div className="lostFiltersGrid">
                        <div className="searchField">
                            <SearchIcon size={18} aria-hidden="true" />
                            <input
                                className="lostInput"
                                placeholder="Caută în descriere..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <FilterSelect className="lostSelect" value={species} onChange={(e) => setSpecies(e.target.value)}>
                            <option value="ALL">Toate speciile</option>
                            <option value="Câine">Câine</option>
                            <option value="Pisică">Pisică</option>
                            <option value="Pasăre">Pasăre</option>
                            <option value="Rozător">Rozător</option>
                            <option value="Altul">Altul</option>
                        </FilterSelect>
                        <FilterSelect className="lostSelect" value={city} onChange={(e) => setCity(e.target.value)}>
                            <option value="ALL">Toate orașele</option>
                            {allCities.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </FilterSelect>
                        <AppButton className="lostBtnReset" variant="ghost" onClick={resetFilters}>
                            Reset
                        </AppButton>
                    </div>
                </div>

                {filtered.length > 0 ? (
                    <div className="lostCards">
                        {filtered.map((a) => (
                            <LostPetCard key={a.id} a={a} />
                        ))}
                    </div>
                ) : (
                    <div className="lostEmpty">Nu există rezultate pentru filtrele selectate.</div>
                )}
            </div>
        </div>
    );
}
