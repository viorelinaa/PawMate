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
            <h1>Donații</h1>
            <p>ONG-uri și adăposturi care au nevoie de ajutor.</p>
        </div>
    );
}
