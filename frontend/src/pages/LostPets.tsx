import { useState } from "react";
import "../styles/LostPets.css";
import { UserOnly } from "../components/UserOnly";

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
                    <h1 className="lostTitle heroTitle">Animale pierdute</h1>
                    <p className="lostSub heroSubtitle">Caută în anunțuri și ajută la găsirea lor.</p>
                </div>
            </section>

            <UserOnly>
                <div className="roleActionBar">
                    <button className="roleActionBtn" onClick={() => alert("Formular adăugare anunț — în curând!")}>
                        + Adaugă anunț animal pierdut
                    </button>
                </div>
            </UserOnly>

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
