import { useState } from "react";
import "../styles/MedGuide.css";
import { SearchIcon } from "../components/SearchIcon";
import { AppButton } from "../components/AppButton";

type MedicalCardProps = {
    title: string;
    description: string;
    items: string[];
};

const medCards: MedicalCardProps[] = [
    {
        title: "Semne de alarmă",
        description: "Atunci când trebuie să mergi urgent la veterinar:",
        items: [
            "Lipsa poftei de mâncare > 24h",
            "Letargie puternică / apatie",
            "Respirație grea, tuse persistentă",
            "Vărsături sau diaree repetată",
            "Sângerare vizibilă",
            "Abdomen umflat sau dureros",
        ],
    },
    {
        title: "Prevenție",
        description: "Păstrează-ți animalul sănătos:",
        items: [
            "Vaccinuri la timp",
            "Deparazitare periodică",
            "Hidratare și hrană potrivită",
            "Vizite regulate la veterinar",
            "Controlul greutății",
            "Microcipare și identificare",
        ],
    },
    {
        title: "Îngrijire zilnică",
        description: "Menține rutina sănătoasă:",
        items: [
            "Exercițiu fizic regulat",
            "Igienă dentară",
            "Curățarea urechilor și ochilor",
            "Periaj regulat al blănii",
            "Apă proaspătă permanent",
            "Observă apetitul și scaunul",
        ],
    },
    {
        title: "Prim ajutor de bază",
        description: "Lucruri utile până ajungi la veterinar:",
        items: [
            "Păstrează un kit de prim ajutor",
            "Curăță plăgi superficiale cu ser fiziologic",
            "Nu administra medicamente umane",
            "Ține animalul calm și ferit de stres",
            "Sună la veterinar înainte de transport",
        ],
    },
    {
        title: "Nutriție & greutate",
        description: "Sfaturi simple pentru o dietă sănătoasă:",
        items: [
            "Porții măsurate, la ore fixe",
            "Recompensele sub 10% din dietă",
            "Evită oase gătite și resturi grase",
            "Hrana adaptată vârstei și rasei",
            "Monitorizează greutatea lunar",
        ],
    },
];

function MedicalCard({ title, description, items }: MedicalCardProps) {
    return (
        <div className="card">
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description}</p>
            <ul className="card-list">
                {items.map((item, i) => (
                    <li key={i} className="card-list-item">
                        <span className="bullet">•</span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function MedGuide() {
    const [query, setQuery] = useState("");

    const filtered = medCards.filter((card) =>
        card.title.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="med-guide">
            {/* HERO */}
            <section className="hero">
                <div className="cloud cloud-left" />
                <div className="cloud cloud-right" />

                <div className="paw-print paw-1">🐾</div>
                <div className="paw-print paw-2">🐾</div>
                <div className="paw-print paw-3">🐾</div>
                <div className="paw-print paw-4">🐾</div>
                <div className="paw-print paw-5">🐾</div>
                <div className="paw-print paw-6">🐾</div>
                <div
                    className="paw-print"
                    style={{ top: "120px", left: "260px", transform: "rotate(18deg)", fontSize: "22px" }}
                >
                    🐾
                </div>
                <div
                    className="paw-print"
                    style={{ bottom: "70px", right: "220px", transform: "rotate(-12deg)", fontSize: "22px" }}
                >
                    🐾
                </div>

                <div className="hero-content">
                    <h1 className="hero-title heroTitle">Ghid Medical</h1>
                    <p className="hero-subtitle heroSubtitle">
                        Tot ce ai nevoie despre sănătatea animalelor de companie
                    </p>
                </div>
            </section>

            {/* CONTENT */}
            <main className="main-content">
                <h2 className="section-title">Informații Esențiale</h2>
                <p className="section-subtitle">
                    Semne de alarmă + prevenție (general, nu medical advice).
                </p>

                <div className="medFilters">
                    <div className="medFiltersGrid">
                        <div className="searchField">
                            <SearchIcon size={18} aria-hidden="true" />
                            <input
                                className="medFilterInput"
                                type="text"
                                placeholder="Caută articol medical..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <AppButton className="medBtnReset" variant="ghost" onClick={() => setQuery("")}>
                            Reset
                        </AppButton>
                    </div>
                </div>

                {filtered.length > 0 ? (
                    <div className="cards-grid">
                        {filtered.map((card) => (
                            <MedicalCard key={card.title} {...card} />
                        ))}
                    </div>
                ) : (
                    <div className="medNoResults">
                        Niciun articol găsit pentru „{query}".
                    </div>
                )}
            </main>
        </div>
    );
}
