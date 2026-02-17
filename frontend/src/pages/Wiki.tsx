import { useState } from "react";
import "./Wiki.css";

interface AnimalData {
    id: number;
    name: string;
    category: string;
    emoji: string;
    temperament: string;
    lifespan: string;
    size: string;
    care: string;
    description: string;
}

export default function Wiki() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Toate");

    const animals: AnimalData[] = [
        {
            id: 1,
            name: "Labrador Retriever",
            category: "Câini",
            emoji: "🦮",
            temperament: "Prietenos, Activ, Loial",
            lifespan: "10-12 ani",
            size: "Mare (25-36 kg)",
            care: "Mediu",
            description: "Labradorul este una dintre cele mai populare rase de câini, cunoscut pentru natura sa prietenoasă și energică. Excelent cu copiii și ușor de antrenat."
        },
        {
            id: 2,
            name: "Golden Retriever",
            category: "Câini",
            emoji: "🐕",
            temperament: "Blând, Inteligent, Devotat",
            lifespan: "10-12 ani",
            size: "Mare (25-34 kg)",
            care: "Mediu-Ridicat",
            description: "Golden Retriever este cunoscut pentru blândețea și inteligența sa. Perfect pentru familii și foarte ușor de antrenat."
        },
        {
            id: 3,
            name: "Beagle",
            category: "Câini",
            emoji: "🐶",
            temperament: "Curios, Prietenos, Vesel",
            lifespan: "12-15 ani",
            size: "Mediu (9-11 kg)",
            care: "Mediu",
            description: "Beagle este un câine energic și curios, excelent pentru familii active. Are un miros foarte dezvoltat și adoră să exploreze."
        },
        {
            id: 4,
            name: "Pisica Persană",
            category: "Pisici",
            emoji: "😺",
            temperament: "Calm, Afectuos, Liniștit",
            lifespan: "12-17 ani",
            size: "Mediu (3.5-5.5 kg)",
            care: "Ridicat",
            description: "Pisica Persană este cunoscută pentru blana sa lungă și luxoasă și personalitatea calmă. Necesită îngrijire zilnică a blănii."
        },
        {
            id: 5,
            name: "Pisica Siameză",
            category: "Pisici",
            emoji: "🐱",
            temperament: "Vocal, Inteligent, Social",
            lifespan: "15-20 ani",
            size: "Mediu (2.5-5.5 kg)",
            care: "Mediu",
            description: "Pisica Siameză este extrem de vocală și socială. Adoră interacțiunea umană și este foarte inteligentă și jucăușă."
        },
        {
            id: 6,
            name: "Pisica Maine Coon",
            category: "Pisici",
            emoji: "😻",
            temperament: "Prietenos, Jucăuș, Adaptabil",
            lifespan: "12-15 ani",
            size: "Mare (5.5-8 kg)",
            care: "Mediu",
            description: "Maine Coon este una dintre cele mai mari rase de pisici domestice. Extrem de prietenoasă și cu o personalitate asemănătoare câinilor."
        },
        {
            id: 7,
            name: "Hamster Syrian",
            category: "Rozătoare",
            emoji: "🐹",
            temperament: "Solitar, Nocturn, Jucăuș",
            lifespan: "2-3 ani",
            size: "Mic (100-150g)",
            care: "Scăzut",
            description: "Hamsterul Syrian este perfect pentru începători. Este solitar și preferă să trăiască singur, fiind activ în special noaptea."
        },
        {
            id: 8,
            name: "Iepure Pitic",
            category: "Rozătoare",
            emoji: "🐰",
            temperament: "Social, Timid, Curios",
            lifespan: "8-12 ani",
            size: "Mic (1-2 kg)",
            care: "Mediu",
            description: "Iepurele pitic este un animal social și afectuos care necesită atenție zilnică și un spațiu generos pentru a se mișca."
        },
        {
            id: 9,
            name: "Cobai",
            category: "Rozătoare",
            emoji: "🐹",
            temperament: "Social, Vocal, Prietenos",
            lifespan: "5-7 ani",
            size: "Mic (700-1200g)",
            care: "Mediu",
            description: "Cobaiul este extrem de social și preferă să trăiască în grupuri. Este vocal și va comunica prin diferite sunete."
        },
        {
            id: 10,
            name: "Papagal Perușă",
            category: "Păsări",
            emoji: "🦜",
            temperament: "Social, Jucăuș, Vocal",
            lifespan: "10-15 ani",
            size: "Mic (30-40g)",
            care: "Mediu",
            description: "Perușa este o pasăre mică și socială, perfectă pentru începători. Poate învăța să vorbească și să facă trucuri simple."
        },
        {
            id: 11,
            name: "Canarul",
            category: "Păsări",
            emoji: "🐦",
            temperament: "Melodios, Independent, Liniștit",
            lifespan: "10-15 ani",
            size: "Mic (15-25g)",
            care: "Scăzut-Mediu",
            description: "Canarul este cunoscut pentru cântecul său melodios. Este mai independent decât alte păsări și nu necesită interacțiune constantă."
        },
        {
            id: 12,
            name: "Agapornis",
            category: "Păsări",
            emoji: "🦜",
            temperament: "Afectuos, Social, Energic",
            lifespan: "10-15 ani",
            size: "Mic (40-60g)",
            care: "Mediu-Ridicat",
            description: "Agapornisul, cunoscut și ca 'lovebird', este extrem de afectuos și preferă să trăiască în perechi sau cu partenerul uman."
        }
    ];

    const categories = ["Toate", "Câini", "Pisici", "Rozătoare", "Păsări"];

    const filteredAnimals = animals.filter(animal => {
        const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            animal.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "Toate" || animal.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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

            {/* Animals Grid Section */}
            <section className="animalsSection">
                <div className="animalsContainer">
                    {filteredAnimals.length > 0 ? (
                        filteredAnimals.map((animal) => (
                            <div key={animal.id} className="animalCard">
                                <div className="animalEmoji">{animal.emoji}</div>
                                <h3 className="animalName">{animal.name}</h3>
                                <span className="animalCategory">{animal.category}</span>
                                <p className="animalPreview">{animal.description.substring(0, 100)}...</p>
                                <button className="btnLearnMore">Află mai multe</button>
                            </div>
                        ))
                    ) : (
                        <div className="noResults">
                            <p>Nu au fost găsite rezultate pentru căutarea ta.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}