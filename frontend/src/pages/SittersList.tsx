import { useState } from "react";
import "../styles/petSitting.css";
import { UserOnly } from "../components/UserOnly";
import { SearchIcon } from "../components/SearchIcon";

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

export default function SittersList() {
    const [query, setQuery] = useState("");

    const filtered = SITERS.filter(
        (s) =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.city.toLowerCase().includes(query.toLowerCase())
    );

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
                    <button className="roleActionBtn" onClick={() => alert("Formular adăugare profil sitter — în curând!")}>
                        + Adaugă profil sitter
                    </button>
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
                    <span className="filter-reset" onClick={() => setQuery("")}>Reset</span>
                    <span className="filter-rating">⭐ rating inclus</span>
                    <span className="filter-price">Preț / zi</span>
                </div>

                {/* Cards */}
                <div className="sitters-grid">
                    {filtered.map((s) => (
                        <div className="sitter-card" key={s.id}>
                            <div className="rating">⭐ {s.rating}</div>
                            <h3>{s.name}</h3>
                            <p className="city">{s.city}</p>
                            <p>{s.desc}</p>
                            <div className="card-footer">
                                <strong>{s.pricePerDay} MDL / zi</strong>
                                <button>Rezervă</button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
