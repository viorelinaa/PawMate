import { useState, useEffect } from "react";
import "../styles/LostPets.css";
import { UserOnly } from "../components/UserOnly";
import { SearchIcon } from "../components/SearchIcon";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";
import { FilterSelect } from "../components/FilterSelect";
import { getLostPets, AddLostPetModal, EditLostPetModal, DeleteLostPetModal, LostPetCard } from "../components/LostPetModals";
import type { LostPet } from "../services/lostPetService";

export default function LostPets() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editAd, setEditAd] = useState<LostPet | null>(null);
    const [deleteAd, setDeleteAd] = useState<LostPet | null>(null);
    const [ads, setAds] = useState<LostPet[]>([]);
    const [allCities, setAllCities] = useState<string[]>([]);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [species, setSpecies] = useState("ALL");
    const [city, setCity] = useState("ALL");

    async function loadAds() {
        try {
            const data = await getLostPets({
                search: query,
                species,
                city,
            });
            setAds(data);
            setLoadError(null);
        } catch {
            setLoadError("Nu s-au putut incarca anunturile. Verifica conexiunea la server.");
        }
    }

    async function loadLostPetFilterOptions() {
        try {
            const data = await getLostPets();
            setAllCities([...new Set(data.map((a) => a.city).filter(Boolean))]);
        } catch {
            setAllCities([]);
        }
    }

    useEffect(() => {
        void loadLostPetFilterOptions();
    }, []);

    useEffect(() => {
        void loadAds();
    }, [query, species, city]);
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
                <span className="lostPaw" style={{ top: "30px", left: "120px", transform: "rotate(14deg)", fontSize: "20px" }}>🐾</span>
                <span className="lostPaw" style={{ bottom: "70px", right: "120px", transform: "rotate(-10deg)", fontSize: "22px" }}>🐾</span>
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

            {showAddModal && (
                <AddLostPetModal onClose={() => setShowAddModal(false)} onAdded={loadAds} />
            )}
            {editAd && (
                <EditLostPetModal ad={editAd} onClose={() => setEditAd(null)} onUpdated={loadAds} />
            )}
            {deleteAd && (
                <DeleteLostPetModal ad={deleteAd} onClose={() => setDeleteAd(null)} onDeleted={loadAds} />
            )}

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

                {loadError && (
                    <div className="lostEmpty" style={{ color: "red" }}>{loadError}</div>
                )}

                {!loadError && ads.length > 0 ? (
                    <div className="lostCards">
                        {ads.map((a) => (
                            <LostPetCard key={a.id} a={a} onEdit={setEditAd} onDelete={setDeleteAd} />
                        ))}
                    </div>
                ) : (
                    !loadError && <div className="lostEmpty">Nu există rezultate pentru filtrele selectate.</div>
                )}
            </div>
        </div>
    );
}
