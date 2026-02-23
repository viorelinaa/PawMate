import { useEffect, useRef, useState } from "react";
import "../styles/petSitting.css";
import { UserOnly } from "../components/UserOnly";
import { SearchIcon } from "../components/SearchIcon";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";

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
    const [query, setQuery] = useState("");
    const [onlyTopRated, setOnlyTopRated] = useState(false);
    const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");
    const [priceMenuOpen, setPriceMenuOpen] = useState(false);
    const priceMenuRef = useRef<HTMLDivElement | null>(null);
    const ratingThreshold = 4.7;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!priceMenuRef.current) return;
            if (!priceMenuRef.current.contains(event.target as Node)) {
                setPriceMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                        onClick={() => alert("Formular adăugare profil sitter — în curând!")}
                    />
                </div>
            </UserOnly>

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
                    <div className="filter-dropdown" ref={priceMenuRef}>
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
