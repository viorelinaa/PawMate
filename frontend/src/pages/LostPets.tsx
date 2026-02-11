interface LostAd {
    id: string;
    species: string;
    city: string;
    date: string;
    contact: string;
    description: string;
}

const lostAds: LostAd[] = [
    {
        id: "l1", species: "Câine", city: "Chișinău", date: "2026-02-01",
        contact: "+373 6xx xxx xxx",
        description: "Câine bej, zgardă albastră, pierdut în zona Botanica.",
    },
    {
        id: "l2", species: "Pisică", city: "Bălți", date: "2026-01-29",
        contact: "+373 7xx xxx xxx",
        description: "Pisică tigrată, foarte sperioasă, răspunde la Mura.",
    },
];

export default function LostPets() {
    return (
        <div>
            <h1>Animale pierdute</h1>
            <p>Caută în anunțuri și ajută la găsirea lor.</p>
        </div>
    );
}
