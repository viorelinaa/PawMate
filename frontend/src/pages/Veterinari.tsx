import { useState } from "react";

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
        <div>
            <h1>Veterinari</h1>
        </div>
    );
}
