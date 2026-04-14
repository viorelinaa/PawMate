import { useEffect, useState, type FocusEvent } from "react";
import "../styles/petSitting.css";
import { UserOnly } from "../components/UserOnly";
import { SearchIcon } from "../components/SearchIcon";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";
import {
    getSitters,
    AddSitterModal,
    EditSitterModal,
    DeleteSitterConfirmModal,
    SitterCard,
} from "../components/SitterModals";
import type { Sitter } from "../services/sitterService";

export default function SittersList() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editSitter, setEditSitter] = useState<Sitter | null>(null);
    const [deleteSitterTarget, setDeleteSitterTarget] = useState<Sitter | null>(null);
    const [sitters, setSitters] = useState<Sitter[]>([]);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [onlyTopRated, setOnlyTopRated] = useState(false);
    const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");
    const [priceMenuOpen, setPriceMenuOpen] = useState(false);
    const ratingThreshold = 4.7;

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

    const rated = onlyTopRated
        ? filtered.filter((s) => s.rating >= ratingThreshold)
        : filtered;

    const sorted = [...rated].sort((a, b) => {
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

    const ratingLabel = `⭐ rating ${ratingThreshold}+`;

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
            {editSitter && (
                <EditSitterModal
                    sitter={editSitter}
                    onClose={() => setEditSitter(null)}
                    onUpdated={loadSitters}
                />
            )}
            {deleteSitterTarget && (
                <DeleteSitterConfirmModal
                    sitter={deleteSitterTarget}
                    onClose={() => setDeleteSitterTarget(null)}
                    onDeleted={loadSitters}
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
                                    onClick={() => { setPriceSort("none"); setPriceMenuOpen(false); }}
                                    role="menuitem"
                                >
                                    Fara sortare
                                </AppButton>
                                <AppButton
                                    type="button"
                                    variant={priceSort === "asc" ? "primary" : "ghost"}
                                    onClick={() => { setPriceSort("asc"); setPriceMenuOpen(false); }}
                                    role="menuitem"
                                >
                                    Crescator
                                </AppButton>
                                <AppButton
                                    type="button"
                                    variant={priceSort === "desc" ? "primary" : "ghost"}
                                    onClick={() => { setPriceSort("desc"); setPriceMenuOpen(false); }}
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
                            <SitterCard
                                key={s.id}
                                s={s}
                                onEdit={setEditSitter}
                                onDelete={setDeleteSitterTarget}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
