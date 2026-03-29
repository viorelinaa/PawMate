import { useState, useEffect } from "react";
import "../styles/Adoption.css";
import { UserOnly } from "../components/UserOnly";
import { SearchIcon } from "../components/SearchIcon";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";
import { FilterSelect } from "../components/FilterSelect";
import { getPets, AddPetModal, EditPetModal, DeleteConfirmModal, PetCard } from "../components/PetModals";
import type { Pet } from "../services/petService";

// ── Pagina principală ─────────────────────────────────────────────────────────
export default function Adoption() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editPet, setEditPet] = useState<Pet | null>(null);
    const [deletePetTarget, setDeletePetTarget] = useState<Pet | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [city, setCity] = useState("ALL");
    const [species, setSpecies] = useState("ALL");
    const [age, setAge] = useState("ALL");
    const [size, setSize] = useState("ALL");
    const [onlyVacc, setOnlyVacc] = useState(false);
    const [onlySter, setOnlySter] = useState(false);

    async function loadPets() {
        try {
            const data = await getPets();
            setPets(data);
            setLoadError(null);
        } catch {
            setLoadError("Nu s-au putut încărca animalele. Verifică conexiunea la server.");
        }
    }

    useEffect(() => {
        loadPets();
    }, []);

    const allCities = [...new Set(pets.map((p) => p.city).filter(Boolean))];

    const filtered = pets.filter((p) => {
        if (city !== "ALL" && p.city !== city) return false;
        if (species !== "ALL" && p.species !== species) return false;
        if (age !== "ALL" && p.age !== age) return false;
        if (size !== "ALL" && p.size !== size) return false;
        if (onlyVacc && !p.vaccinated) return false;
        if (onlySter && !p.sterilized) return false;
        if (query) {
            const q = query.toLowerCase();
            if (!p.name.toLowerCase().includes(q) && !p.description?.toLowerCase().includes(q))
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
                <span className="adoptionPaw" style={{ top: "32px", left: "140px", transform: "rotate(8deg)", fontSize: "20px" }}>🐾</span>
                <span className="adoptionPaw" style={{ bottom: "80px", right: "140px", transform: "rotate(-12deg)", fontSize: "22px" }}>🐾</span>
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

            {showAddModal && (
                <AddPetModal onClose={() => setShowAddModal(false)} onAdded={loadPets} />
            )}
            {editPet && (
                <EditPetModal pet={editPet} onClose={() => setEditPet(null)} onUpdated={loadPets} />
            )}
            {deletePetTarget && (
                <DeleteConfirmModal pet={deletePetTarget} onClose={() => setDeletePetTarget(null)} onDeleted={loadPets} />
            )}

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

                {loadError && (
                    <div className="emptyNotice" style={{ color: "red" }}>{loadError}</div>
                )}

                {!loadError && filtered.length > 0 ? (
                    <div className="petCards">
                        {filtered.map((p) => (
                            <PetCard
                                key={p.id}
                                p={p}
                                onEdit={setEditPet}
                                onDelete={setDeletePetTarget}
                            />
                        ))}
                    </div>
                ) : (
                    !loadError && <div className="emptyNotice">Nu există rezultate pentru filtrele selectate.</div>
                )}
            </div>
        </div>
    );
}
