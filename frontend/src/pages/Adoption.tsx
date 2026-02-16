import { useState } from "react";
import "./Adoption.css";

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

export default function Adoption() {
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
                <div className="adoptionHeroInner">
                    <h1 className="adoptionTitle">Adopție</h1>
                    <p className="adoptionSub">Filtrează și găsește animalul potrivit.</p>
                </div>
            </section>

            <div className="adoptionContent">
            <div className="filters">
                <div className="filtersGrid">
                    <input
                        className="filterInput"
                        placeholder="Caută după nume/descriere..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <select className="filterSelect" value={city} onChange={(e) => setCity(e.target.value)}>
                        <option value="ALL">Toate orașele</option>
                        {allCities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <select className="filterSelect" value={species} onChange={(e) => setSpecies(e.target.value)}>
                        <option value="ALL">Toate speciile</option>
                        <option value="Câine">Câine</option>
                        <option value="Pisică">Pisică</option>
                        <option value="Pasăre">Pasăre</option>
                        <option value="Rozător">Rozător</option>
                        <option value="Altul">Altul</option>
                    </select>
                    <button className="btnReset" onClick={resetFilters}>Reset filtre</button>

                    <select className="filterSelect" value={age} onChange={(e) => setAge(e.target.value)}>
                        <option value="ALL">Toate vârstele</option>
                        <option value="Pui">Pui</option>
                        <option value="Adult">Adult</option>
                        <option value="Senior">Senior</option>
                    </select>
                    <select className="filterSelect" value={size} onChange={(e) => setSize(e.target.value)}>
                        <option value="ALL">Toate taliile</option>
                        <option value="Mic">Mic</option>
                        <option value="Mediu">Mediu</option>
                        <option value="Mare">Mare</option>
                    </select>
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
                        <div className="petCard" key={p.id}>
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
                            <button className="btnDetails" onClick={() => alert("Cerere trimisă (mock)!")}>
                                Cere detalii
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="emptyNotice">Nu există rezultate pentru filtrele selectate.</div>
            )}
            </div>
        </div>
    );
}
