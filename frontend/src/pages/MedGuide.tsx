import "../styles/MedGuide.css";

type MedicalCardProps = {
    title: string;
    description: string;
    items: string[];
};

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

                <div className="cards-grid">
                    <MedicalCard
                        title="Semne de alarmă"
                        description="Atunci când trebuie să mergi urgent la veterinar:"
                        items={[
                            "Lipsa poftei de mâncare > 24h",
                            "Letargie puternică / apatie",
                            "Respirație grea, tuse persistentă",
                            "Vărsături sau diaree repetată",
                            "Sângerare vizibilă",
                            "Abdomen umflat sau dureros",
                        ]}
                    />

                    <MedicalCard
                        title="Prevenție"
                        description="Păstrează-ți animalul sănătos:"
                        items={[
                            "Vaccinuri la timp",
                            "Deparazitare periodică",
                            "Hidratare și hrană potrivită",
                            "Vizite regulate la veterinar",
                            "Controlul greutății",
                            "Microcipare și identificare",
                        ]}
                    />

                    <MedicalCard
                        title="Îngrijire zilnică"
                        description="Menține rutina sănătoasă:"
                        items={[
                            "Exercițiu fizic regulat",
                            "Igienă dentară",
                            "Curățarea urechilor și ochilor",
                            "Periaj regulat al blănii",
                            "Apă proaspătă permanent",
                            "Observă apetitul și scaunul",
                        ]}
                    />

                    <MedicalCard
                        title="Prim ajutor de bază"
                        description="Lucruri utile până ajungi la veterinar:"
                        items={[
                            "Păstrează un kit de prim ajutor",
                            "Curăță plăgi superficiale cu ser fiziologic",
                            "Nu administra medicamente umane",
                            "Ține animalul calm și ferit de stres",
                            "Sună la veterinar înainte de transport",
                        ]}
                    />

                    <MedicalCard
                        title="Nutriție & greutate"
                        description="Sfaturi simple pentru o dietă sănătoasă:"
                        items={[
                            "Porții măsurate, la ore fixe",
                            "Recompensele sub 10% din dietă",
                            "Evită oase gătite și resturi grase",
                            "Hrana adaptată vârstei și rasei",
                            "Monitorizează greutatea lunar",
                        ]}
                    />
                </div>
            </main>
        </div>
    );
}
