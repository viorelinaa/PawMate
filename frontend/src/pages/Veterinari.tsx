import { useState } from "react";
import "../styles/Veterinari.css";
import { AdminOnly } from "../components/AdminOnly";
import { SearchIcon } from "../components/SearchIcon";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";
import { FilterSelect } from "../components/FilterSelect";

interface Veterinar {
    id: string;
    name: string;
    city: string;
    address: string;
    phone: string;
    services: string[];
    emergency: boolean;
    description: string;
}

const veterinariList: Veterinar[] = [
    {
        id: "v1",
        name: "Clinica Veterinară PetCare",
        city: "Chișinău",
        address: "Str. Alexandru cel Bun 15",
        phone: "022 123 456",
        services: ["Consultații", "Vaccinări", "Chirurgie", "Radiologie"],
        emergency: true,
        description: "Clinică modernă cu echipament de ultimă generație și personal calificat.",
    },
    {
        id: "v2",
        name: "Clinica AnimalMed",
        city: "Bălți",
        address: "Str. Ștefan cel Mare 45",
        phone: "0231 45 678",
        services: ["Consultații", "Vaccinări", "Analize de laborator"],
        emergency: false,
        description: "Servicii veterinare de calitate pentru animale de companie.",
    },
    {
        id: "v3",
        name: "Veterinarul Tău",
        city: "Chișinău",
        address: "Bd. Dacia 27",
        phone: "022 987 654",
        services: ["Consultații", "Vaccinări", "Deparazitare", "Sterilizare"],
        emergency: true,
        description: "Cabinet veterinar cu experiență de peste 15 ani în domeniu.",
    },
    {
        id: "v4",
        name: "Clinica VetLife",
        city: "Cahul",
        address: "Str. Independenței 12",
        phone: "0299 12 345",
        services: ["Consultații", "Vaccinări", "Stomatologie"],
        emergency: false,
        description: "Îngrijire profesională pentru animale de companie.",
    },
];

const allCities = [...new Set(veterinariList.map((v) => v.city))];

function VeterinarCard({ v }: { v: Veterinar }) {
    return (
        <div className="vetCard">
            <div className="vetCardHeader">
                <div>
                    <h3 className="vetName">{v.name}</h3>
                    <span className="vetCity">{v.city}</span>
                </div>
                {v.emergency && <span className="emergencyBadge">Urgențe 24/7</span>}
            </div>
            <p className="vetAddress">📍 {v.address}</p>
            <p className="vetPhone">📞 {v.phone}</p>
            <div className="services">
                {v.services.map((service) => (
                    <span key={service} className="serviceBadge">
                        {service}
                    </span>
                ))}
            </div>
            <p className="vetDesc">{v.description}</p>
            <AppButton className="btnContact" variant="primary" onClick={() => alert(`Sună la ${v.phone}`)}>
                Contactează
            </AppButton>
        </div>
    );
}

export default function Veterinari() {
    const [query, setQuery] = useState("");
    const [city, setCity] = useState("ALL");
    const [onlyEmergency, setOnlyEmergency] = useState(false);

    const filtered = veterinariList.filter((v) => {
        if (city !== "ALL" && v.city !== city) return false;
        if (onlyEmergency && !v.emergency) return false;
        if (query) {
            const q = query.toLowerCase();
            if (
                !v.name.toLowerCase().includes(q) &&
                !v.description.toLowerCase().includes(q) &&
                !v.address.toLowerCase().includes(q)
            )
                return false;
        }
        return true;
    });

    function resetFilters() {
        setQuery("");
        setCity("ALL");
        setOnlyEmergency(false);
    }

    return (
        <div className="veterinariPage">
            <section className="veterinariHero">
                <div className="veterinariCloud vc1" />
                <div className="veterinariCloud vc2" />
                <span className="veterinariPaw vp1">🐾</span>
                <span className="veterinariPaw vp2">🐾</span>
                <span className="veterinariPaw vp3">🐾</span>
                <span
                    className="veterinariPaw"
                    style={{ top: "30px", left: "130px", transform: "rotate(12deg)", fontSize: "20px" }}
                >
                    🐾
                </span>
                <span
                    className="veterinariPaw"
                    style={{ bottom: "78px", right: "130px", transform: "rotate(-10deg)", fontSize: "22px" }}
                >
                    🐾
                </span>
                <div className="veterinariHeroInner">
                    <h1 className="veterinariTitle heroTitle">Veterinari</h1>
                    <p className="veterinariSub heroSubtitle">Găsește clinici veterinare din apropiere.</p>
                </div>
            </section>

            <AdminOnly>
                <div className="roleActionBar">
                    <AddActionButton
                        label="Adaugă clinică"
                        onClick={() => alert("Formular adăugare clinică — în curând!")}
                    />
                </div>
            </AdminOnly>

            <div className="veterinariContent">
                <div className="filters">
                    <div className="filtersGrid">
                        <div className="searchField">
                            <SearchIcon size={18} aria-hidden="true" />
                            <input
                                className="filterInput"
                                placeholder="Caută după nume/adresă..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <FilterSelect className="filterSelect" value={city} onChange={(e) => setCity(e.target.value)}>
                            <option value="ALL">Toate orașele</option>
                            {allCities.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </FilterSelect>
                        <label className="filterCheck">
                            <input
                                type="checkbox"
                                checked={onlyEmergency}
                                onChange={(e) => setOnlyEmergency(e.target.checked)}
                            />
                            Doar urgențe 24/7
                        </label>
                        <AppButton className="btnReset" variant="ghost" onClick={resetFilters}>
                            Reset filtre
                        </AppButton>
                    </div>
                </div>

                {filtered.length > 0 ? (
                    <div className="vetCards">
                        {filtered.map((v) => (
                            <VeterinarCard key={v.id} v={v} />
                        ))}
                    </div>
                ) : (
                    <div className="emptyNotice">Nu există rezultate pentru filtrele selectate.</div>
                )}
            </div>
        </div>
    );
}
