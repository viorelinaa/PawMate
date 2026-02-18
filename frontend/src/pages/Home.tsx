// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();

    const cards = [
        { title: "Adopție", desc: "Găsește un prieten nou (cu filtre).", to: "/adoptie" },
        { title: "Animale pierdute", desc: "Anunțuri + căutare.", to: "/pierdute" },
        { title: "Veterinari", desc: "Clinici din apropiere.", to: "/veterinari" },

        { title: "Pet sitting", desc: "Îngrijire când ești plecat.", to: "/sitters" },
        { title: "Donații", desc: "ONG-uri și adăposturi.", to: "/donatii" },
        { title: "Voluntariat", desc: "Implică-te în comunitate.", to: "/voluntariat" },

        { title: "Quiz", desc: "Ce animal ți se potrivește?", to: "/quiz" },
        { title: "Wiki", desc: "Informații pe specii.", to: "/wiki" },
        { title: "Ghid medical", desc: "Semne & prevenție.", to: "/ghid-medical" },

        { title: "Blog", desc: "Articole utile.", to: "/blog" },
        { title: "Evenimente", desc: "Târguri, întâlniri, voluntariat.", to: "/evenimente" },
        { title: "Vânzări", desc: "Produse (mock).", to: "/vanzari" },
    ];

    return (
        <div className="home">
            <section className="hero">
                <div className="cloud c1" />
                <div className="cloud c2" />

                <div className="paw p1">🐾</div>
                <div className="paw p2">🐾</div>
                <div className="paw p3">🐾</div>
                <div className="paw p4">🐾</div>
                <div className="paw p5">🐾</div>
                <div className="paw p6">🐾</div>
                <div className="paw" style={{ top: "36px", left: "140px", transform: "rotate(10deg)", fontSize: "20px" }}>
                    🐾
                </div>
                <div className="paw" style={{ bottom: "84px", right: "140px", transform: "rotate(-12deg)", fontSize: "22px" }}>
                    🐾
                </div>

                <div className="heroInner">
                    <h1 className="heroTitle">PawMate</h1>

                    <p className="heroSubtitle">
                        Tot ce ai nevoie despre animalele de companie
                    </p>

                    <div className="heroActions">
                        <button className="btnPrimary" onClick={() => navigate("/adoptie")}>
                            Începe cu adopția
                        </button>

                        <button className="btnGhost" onClick={() => navigate("/quiz")}>
                            Fă quiz-ul
                        </button>
                    </div>
                </div>
            </section>

            <section className="explore">
                <h2 className="exploreTitle">Explorează rapid</h2>
                <p className="exploreSub">Alege o secțiune și continuă.</p>

                <div className="cards">
                    {cards.map((c) => (
                        <div key={c.title} className="card" onClick={() => navigate(c.to)}>
                            <h3 className="cardTitle">{c.title}</h3>
                            <p className="cardDesc">{c.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
