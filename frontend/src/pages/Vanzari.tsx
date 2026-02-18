import { useState } from "react";
import "../styles/Vanzari.css";
import { UserOnly } from "../components/UserOnly";
import { SearchIcon } from "../components/SearchIcon";

type Product = {
    id: string;
    name: string;
    category: string;
    description: string;
    price: string;
};

const products: Product[] = [
    {
        id: "p1",
        name: "Hrană uscată 2kg",
        category: "Hrană",
        description: "Pentru câini adulți.",
        price: "199 MDL",
    },
    {
        id: "p2",
        name: "Jucărie minge",
        category: "Jucării",
        description: "Cauciuc rezistent.",
        price: "49 MDL",
    },
    {
        id: "p3",
        name: "Ham reglabil",
        category: "Accesorii",
        description: "Confortabil pentru plimbări.",
        price: "149 MDL",
    },
    {
        id: "p4",
        name: "Șampon blană",
        category: "Îngrijire",
        description: "Blând, pentru piele sensibilă.",
        price: "89 MDL",
    },
    {
        id: "p5",
        name: "Litieră pisici",
        category: "Igienă",
        description: "Absorbantă, fără praf.",
        price: "79 MDL",
    },
    {
        id: "p6",
        name: "Bol inox",
        category: "Accesorii",
        description: "Stabil și ușor de curățat.",
        price: "39 MDL",
    },
];

const allCategories = [...new Set(products.map((product) => product.category))];

export default function Vanzari() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("ALL");

    const filtered = products.filter((product) => {
        if (category !== "ALL" && product.category !== category) return false;
        if (query) {
            const q = query.toLowerCase();
            if (
                !product.name.toLowerCase().includes(q) &&
                !product.description.toLowerCase().includes(q)
            )
                return false;
        }
        return true;
    });

    function resetFilters() {
        setQuery("");
        setCategory("ALL");
    }

    return (
        <div className="salesPage">
            <section className="salesHero">
                <div className="salesCloud sc1" />
                <div className="salesCloud sc2" />
                <span className="salesPaw sp1">🐾</span>
                <span className="salesPaw sp2">🐾</span>
                <span className="salesPaw sp3">🐾</span>
                <div className="salesHeroInner">
                    <h1 className="salesTitle heroTitle">Vânzări</h1>
                    <p className="salesSubtitle heroSubtitle">Produse pentru animale (mock).</p>
                </div>
            </section>

            <UserOnly>
                <div className="roleActionBar">
                    <button className="roleActionBtn" onClick={() => alert("Formular adăugare produs — în curând!")}>
                        + Adaugă produs/anunț
                    </button>
                </div>
            </UserOnly>

            <section className="salesContent">
                <div className="salesFilters">
                    <div className="salesFiltersGrid">
                        <div className="searchField">
                            <SearchIcon size={18} aria-hidden="true" />
                            <input
                                className="filterInput"
                                placeholder="Caută după nume..."
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                            />
                        </div>
                        <select
                            className="filterSelect"
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                        >
                            <option value="ALL">Toate categoriile</option>
                            {allCategories.map((entry) => (
                                <option key={entry} value={entry}>
                                    {entry}
                                </option>
                            ))}
                        </select>
                        <button className="btnReset" onClick={resetFilters}>
                            Reset filtre
                        </button>
                    </div>
                </div>

                {filtered.length > 0 ? (
                    <div className="salesGrid">
                        {filtered.map((product) => (
                            <article className="salesCard" key={product.id}>
                                <div className="salesCardTop">
                                    <h3 className="salesName">{product.name}</h3>
                                    <span className="salesBadge">{product.category}</span>
                                </div>
                                <p className="salesDesc">{product.description}</p>
                                <div className="salesPrice">{product.price}</div>
                                <button
                                    className="salesBtn"
                                    type="button"
                                    onClick={() => alert("Adăugat în coș (mock)!")}
                                >
                                    Adaugă în coș
                                </button>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="salesEmpty">
                        Nu există produse pentru filtrele selectate.
                    </div>
                )}
            </section>
        </div>
    );
}
