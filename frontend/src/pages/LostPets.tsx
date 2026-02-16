import { useState } from "react";
import "./LostPets.css";

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
];

export default function LostPets() {
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
                <div className="lostHeroInner">
                    <h1 className="lostTitle">Animale pierdute</h1>
                    <p className="lostSub">Caută în anunțuri și ajută la găsirea lor.</p>
                </div>
            </section>

            <div className="lostContent">
                <div className="lostFilters">
                    <div className="lostFiltersGrid">
                        <input
                            className="lostInput"
                            placeholder="Caută în descriere..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <select className="lostSelect" value={species} onChange={(e) => setSpecies(e.target.value)}>
                            <option value="ALL">Toate speciile</option>
                            <option value="Câine">Câine</option>
                            <option value="Pisică">Pisică</option>
                            <option value="Pasăre">Pasăre</option>
                            <option value="Rozător">Rozător</option>
                            <option value="Altul">Altul</option>
                        </select>
                        <select className="lostSelect" value={city} onChange={(e) => setCity(e.target.value)}>
                            <option value="ALL">Toate orașele</option>
                            {allCities.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <button className="lostBtnReset" onClick={resetFilters}>Reset</button>
                    </div>
                </div>

                {filtered.length > 0 ? (
                    <div className="lostCards">
                        {filtered.map((a) => (
                            <div className="lostCard" key={a.id}>
                                <div className="lostCardHeader">
                                    <span className="lostBadge">{a.species}</span>
                                    <span className="lostSmall">{a.city} • {a.date}</span>
                                </div>
                                <p className="lostDesc">{a.description}</p>
                                <div className="lostBadges">
                                    <span className="lostBadge">Contact: {a.contact}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="lostEmpty">Nu există rezultate pentru filtrele selectate.</div>
                )}
            </div>
        </div>
    );
}
