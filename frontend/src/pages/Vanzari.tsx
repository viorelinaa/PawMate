import { useState } from "react";
import "../styles/Vanzari.css";
import { UserOnly } from "../components/UserOnly";
import { SearchIcon } from "../components/SearchIcon";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";
import { ShoppingCartIcon } from "../components/ShoppingCartIcon";

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

function extractPriceNumber(price: string) {
    const cleaned = price.replace(",", ".").replace(/[^\d.]/g, "");
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
}

function ProductCard({
    product,
    onAddToCart,
}: {
    product: Product;
    onAddToCart: (product: Product) => void;
}) {
    return (
        <article className="salesCard">
            <div className="salesCardTop">
                <h3 className="salesName">{product.name}</h3>
                <span className="salesBadge">{product.category}</span>
            </div>
            <p className="salesDesc">{product.description}</p>
            <div className="salesPrice">{product.price}</div>
            <AppButton
                className="salesBtn"
                variant="primary"
                type="button"
                onClick={() => onAddToCart(product)}
            >
                Adaugă în coș
            </AppButton>
        </article>
    );
}

export default function Vanzari() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("ALL");
    const [cartItems, setCartItems] = useState<Product[]>([]);

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

    function addToCart(product: Product) {
        setCartItems((prev) => [...prev, product]);
    }

    function openCartPreview() {
        if (cartItems.length === 0) {
            alert("Coșul este gol momentan.");
            return;
        }

        const grouped = cartItems.reduce<Record<string, { name: string; price: string; qty: number }>>(
            (acc, product) => {
                if (!acc[product.id]) {
                    acc[product.id] = { name: product.name, price: product.price, qty: 0 };
                }
                acc[product.id].qty += 1;
                return acc;
            },
            {}
        );

        const rows = Object.values(grouped)
            .map((item) => `• ${item.name} x${item.qty} (${item.price})`)
            .join("\n");

        const total = cartItems.reduce((sum, product) => sum + extractPriceNumber(product.price), 0);

        alert(`Coșul tău (mock):\n\n${rows}\n\nTotal produse: ${cartItems.length}\nTotal: ${total.toFixed(0)} MDL`);
    }

    return (
        <div className="salesPage">
            <section className="salesHero">
                <div className="salesCloud sc1" />
                <div className="salesCloud sc2" />
                <span className="salesPaw sp1">🐾</span>
                <span className="salesPaw sp2">🐾</span>
                <span className="salesPaw sp3">🐾</span>
                <span
                    className="salesPaw"
                    style={{ top: "28px", left: "140px", transform: "rotate(8deg)", fontSize: "20px" }}
                >
                    🐾
                </span>
                <span
                    className="salesPaw"
                    style={{ bottom: "78px", right: "140px", transform: "rotate(-12deg)", fontSize: "22px" }}
                >
                    🐾
                </span>
                <div className="salesHeroInner">
                    <h1 className="salesTitle heroTitle">Vânzări</h1>
                    <p className="salesSubtitle heroSubtitle">Produse pentru animale (mock).</p>
                </div>
            </section>

            <UserOnly>
                <div className="roleActionBar salesActionBar">
                    <button
                        type="button"
                        className="roleActionBtn salesCartQuickBtn"
                        onClick={openCartPreview}
                        aria-label={`Vezi coșul (${cartItems.length})`}
                    >
                        <ShoppingCartIcon size={18} aria-hidden="true" />
                        <span>Vezi coșul</span>
                        <span className="salesCartCount" aria-hidden="true">
                            {cartItems.length}
                        </span>
                    </button>
                    <AddActionButton
                        label="Adaugă produs/anunț"
                        onClick={() => alert("Formular adăugare produs — în curând!")}
                    />
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
                        <AppButton className="btnReset" variant="ghost" onClick={resetFilters}>
                            Reset filtre
                        </AppButton>
                    </div>
                </div>

                {filtered.length > 0 ? (
                    <div className="salesGrid">
                        {filtered.map((product) => (
                            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
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
