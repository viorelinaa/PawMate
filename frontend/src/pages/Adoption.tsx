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

export default function Adoption() {
    return (
        <div>
            <h1>Adopție</h1>
            <p>Filtrează și găsește animalul potrivit.</p>
        </div>
    );
}
