import "../styles/Donations.css";
import { AdminOnly } from "../components/AdminOnly";

interface DonationOrg {
    id: string;
    name: string;
    city: string;
    type: string;
    donationLink: string;
    description: string;
}

const donationOrgs: DonationOrg[] = [
    {
        id: "d1", name: "Adăpost Prietenii Blănoșilor", city: "Chișinău", type: "Adăpost",
        donationLink: "#",
        description: "Ajută cu hrană, medicamente și transport.",
    },
    {
        id: "d2", name: "ONG PawHelp", city: "Bălți", type: "ONG",
        donationLink: "#",
        description: "Campanii de sterilizare și adopții responsabile.",
    },
    {
        id: "d3", name: "Asociația AnimalSafe", city: "Chișinău", type: "ONG",
        donationLink: "#",
        description: "Salvare și reabilitare animale abandonate.",
    },
];

export default function Donations() {
    return (
        <div>
            <section className="donHero">
                <div className="donCloud dc1" />
                <div className="donCloud dc2" />
                <span className="donPaw dp1">🐾</span>
                <span className="donPaw dp2">🐾</span>
                <span className="donPaw dp3">🐾</span>
                <div className="donHeroInner">
                    <h1 className="donTitle">Donații</h1>
                    <p className="donSub">ONG-uri și adăposturi care au nevoie de ajutor.</p>
                </div>
            </section>

            <AdminOnly>
                <div className="roleActionBar">
                    <button className="roleActionBtn" onClick={() => alert("Formular adăugare ONG — în curând!")}>
                        + Adaugă ONG
                    </button>
                </div>
            </AdminOnly>

            <div className="donContent">
                <div className="donCards">
                    {donationOrgs.map((o) => (
                        <div className="donCard" key={o.id}>
                            <div className="donCardHeader">
                                <div>
                                    <h3 className="donName">{o.name}</h3>
                                    <span className="donSmall">{o.city}</span>
                                </div>
                                <span className="donBadge">{o.type}</span>
                            </div>
                            <p className="donDesc">{o.description}</p>
                            <div style={{ marginTop: "auto", paddingTop: "14px" }}>
                                <button className="donBtn" onClick={() => alert("Donație (mock)!")}>
                                    Donează
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
