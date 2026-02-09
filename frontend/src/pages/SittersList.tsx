import { useMemo, useState } from "react";
import "./petSitting.css";

type Sitter = {
    id: string;
    name: string;
    city: string;
    desc  : string;
    pricePerDay: number;
    rating: number;
};

const SITERS: Sitter[] = [
    { id: "1", name: "Ana", city: "Chișinău", desc: "Plimbări + îngrijire la domiciliu.", pricePerDay: 250, rating: 4.8 },
    { id: "2", name: "Mihai", city: "Bălți", desc: "Pet sitting pentru pisici și câini mici.", pricePerDay: 180, rating: 4.6 },
    { id: "3", name: "Irina", city: "Chișinău", desc: "Vizite zilnice + hrană + joacă.", pricePerDay: 220, rating: 4.7 },
    { id: "4", name: "Daniel", city: "Cahul", desc: "Găzduire la mine (curte) + update-uri.", pricePerDay: 200, rating: 4.5 },
];

export default function SittersList() {
    const [q, setQ] = useState("");
    const [minRating, setMinRating] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(999);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        return SITERS.filter((s) => {
            const matchesQuery =
                !query ||
                s.name.toLowerCase().includes(query) ||
                s.city.toLowerCase().includes(query);
            const matchesRating = s.rating >= minRating;
            const matchesPrice = s.pricePerDay <= maxPrice;
            return matchesQuery && matchesRating && matchesPrice;
        });
    }, [q, minRating, maxPrice]);

    const reset = () => {
        setQ("");
        setMinRating(0);
        setMaxPrice(999);
    };

    return (
        <div className="ps-page">
            <div className="ps-wrap">
                <header className="ps-header">
                    <h1 className="ps-title">Pet sitting</h1>
                    <p className="ps-subtitle">Caută îngrijitori (mock).</p>
                </header>

                <section className="ps-filters">
                    <div className="ps-search">
                        <input
                            className="ps-input"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Caută după nume sau oraș..."
                        />
                    </div>

                    <button className="ps-reset" onClick={reset} type="button">
                        Reset
                    </button>

                    <div className="ps-control">
                        <span className="ps-controlLabel">⭐ rating inclus</span>
                        <select
                            className="ps-select"
                            value={minRating}
                            onChange={(e) => setMinRating(Number(e.target.value))}
                        >
                            <option value={0}>oricare</option>
                            <option value={4.5}>4.5+</option>
                            <option value={4.6}>4.6+</option>
                            <option value={4.7}>4.7+</option>
                            <option value={4.8}>4.8+</option>
                        </select>
                    </div>

                    <div className="ps-control">
                        <span className="ps-controlLabel">Preț / zi</span>
                        <select
                            className="ps-select"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                        >
                            <option value={999}>oricare</option>
                            <option value={300}>≤ 300 MDL</option>
                            <option value={250}>≤ 250 MDL</option>
                            <option value={220}>≤ 220 MDL</option>
                            <option value={200}>≤ 200 MDL</option>
                        </select>
                    </div>
                </section>

                <section className="ps-grid">
                    {filtered.map((s) => (
                        <article key={s.id} className="ps-card">
                            <div className="ps-cardTop">
                                <div>
                                    <h3 className="ps-name">{s.name}</h3>
                                    <p className="ps-city">{s.city}</p>
                                </div>

                                <div className="ps-rating">
                                    ⭐ {s.rating.toFixed(1)}
                                </div>
                            </div>

                            <p className="ps-desc">{s.desc}</p>

                            <div className="ps-price">{s.pricePerDay} MDL / zi</div>

                            <button
                                className="ps-btn"
                                type="button"
                                onClick={() => alert(`Rezervare mock pentru ${s.name}`)}
                            >
                                Rezervă
                            </button>
                        </article>
                    ))}

                    {filtered.length === 0 && (
                        <div className="ps-empty">
                            N-am găsit nimic. Încearcă alt nume/oraș sau relaxează filtrele.
                        </div>
                    )}
                </section>

                <footer className="ps-footer">
                    © 2026 PetHub. Creat cu ❤️ pentru animale.
                </footer>
            </div>
        </div>
    );
}
