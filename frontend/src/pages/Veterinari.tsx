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

export default function Veterinari() {
    return (
        <div>
            <h1>Veterinari</h1>
        </div>
    );
}
