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
                    <h1 className="hero-title">Ghid Medical</h1>
                    <p className="hero-subtitle">
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
                            "Letargie puternică",
                            "Respirație grea / febră",
                            "Vărsături repetate",
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
                        ]}
                    />
                </div>
            </main>
        </div>
    );
}
