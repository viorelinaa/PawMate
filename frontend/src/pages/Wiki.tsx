import { useState } from "react";
import "./Wiki.css";

export default function Wiki() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Toate");

    const categories = ["Toate", "Câini", "Pisici", "Rozătoare", "Păsări"];

    return (
        <div>
            {/* Hero Section */}
            <section className="wikiHero">
                <div className="wikiCloud wc1" />
                <div className="wikiCloud wc2" />
                <span className="wikiPaw wp1">🐾</span>
                <span className="wikiPaw wp2">🐾</span>
                <span className="wikiPaw wp3">🐾</span>
                <div className="wikiHeroInner">
                    <h1 className="wikiTitle">Wiki Animale</h1>
                    <p className="wikiSub">
                        Descoperă tot ce trebuie să știi despre animalele de companie
                    </p>
                </div>
            </section>

            {/* Introducere Section */}
            <section className="introSection">
                <h2 className="sectionTitle">Ghidul tău complet pentru animale de companie</h2>
                <div className="introGrid">
                    <div className="introCard">
                        <div className="introIcon">🐕</div>
                        <h3>Specii diverse</h3>
                        <p>
                            Explorează informații detaliate despre câini, pisici, rozătoare,
                            păsări și alte animale de companie populare.
                        </p>
                    </div>
                    <div className="introCard">
                        <div className="introIcon">📚</div>
                        <h3>Informații complete</h3>
                        <p>
                            Află totul despre rase, temperament, îngrijire, sănătate și
                            cerințe specifice pentru fiecare animal.
                        </p>
                    </div>
                    <div className="introCard">
                        <div className="introIcon">💡</div>
                        <h3>Sfaturi practice</h3>
                        <p>
                            Descoperă recomandări și sfaturi de la experți pentru a oferi
                            cea mai bună îngrijire animalului tău.
                        </p>
                    </div>
                </div>
            </section>

            {/* Search & Filter Section */}
            <section className="searchSection">
                <div className="searchContainer">
                    <input
                        type="text"
                        className="searchInput"
                        placeholder="Caută după nume sau descriere..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="categoryButtons">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`categoryBtn ${selectedCategory === category ? "active" : ""}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}