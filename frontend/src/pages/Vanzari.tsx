import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "../routes/paths";
import "../styles/Vanzari.css";
import { UserOnly } from "../components/UserOnly";
import { SearchIcon } from "../components/SearchIcon";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";
import { ShoppingCartIcon } from "../components/ShoppingCartIcon";
import { FilterSelect } from "../components/FilterSelect";
import {
    getProducts,
    AddProductModal,
    EditProductModal,
    DeleteProductModal,
    ProductCard,
} from "../components/ProductModals";
import type { Product } from "../services/productService";

const CART_KEY = "pawmate_cart";

export default function Vanzari() {
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("ALL");
    const [cartItems, setCartItems] = useState<Product[]>(() => {
        try {
            const saved = localStorage.getItem(CART_KEY);
            if (!saved) return [];
            const parsed = JSON.parse(saved) as Product[];
            // dacă itemele sunt în formatul vechi (mock, cu price string sau fără title), resetăm
            if (!Array.isArray(parsed) || parsed.some((p) => typeof p.price !== "number" || !p.title)) {
                localStorage.removeItem(CART_KEY);
                return [];
            }
            return parsed;
        } catch {
            return [];
        }
    });
    const [toastVisible, setToastVisible] = useState(false);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    async function loadProducts() {
        try {
            setIsLoading(true);
            const data = await getProducts({
                search: query,
                category,
            });
            setProducts(data);
            setLoadError(null);
        } catch {
            setLoadError("Nu s-au putut incarca produsele. Verifica conexiunea la server.");
        } finally {
            setIsLoading(false);
        }
    }

    async function loadProductFilterOptions() {
        try {
            const data = await getProducts();
            setAllCategories([...new Set(data.map((p) => p.category).filter(Boolean))]);
        } catch {
            setAllCategories([]);
        }
    }

    useEffect(() => {
        void loadProductFilterOptions();
    }, []);

    useEffect(() => {
        void loadProducts();
    }, [query, category]);

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    }, [cartItems]);
    function resetFilters() {
        setQuery("");
        setCategory("ALL");
    }

    function addToCart(product: Product) {
        setCartItems((prev) => [...prev, product]);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        setToastVisible(true);
        toastTimer.current = setTimeout(() => setToastVisible(false), 2200);
    }

    function openCartPreview() {
        navigate(paths.cos, { state: { cartItems } });
    }

    return (
        <div className="salesPage">
            {toastVisible && (
                <div className="salesToast" role="status" aria-live="polite">
                    ✓ Adăugat în coș!
                </div>
            )}
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
                    <p className="salesSubtitle heroSubtitle">Produse pentru animale de companie.</p>
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
                        label="Adaugă produs"
                        onClick={() => setShowAddModal(true)}
                    />
                </div>
            </UserOnly>

            {showAddModal && (
                <AddProductModal onClose={() => setShowAddModal(false)} onAdded={loadProducts} />
            )}
            {editProduct && (
                <EditProductModal
                    product={editProduct}
                    onClose={() => setEditProduct(null)}
                    onUpdated={loadProducts}
                />
            )}
            {deleteProduct && (
                <DeleteProductModal
                    product={deleteProduct}
                    onClose={() => setDeleteProduct(null)}
                    onDeleted={() => {
                        const deletedId = deleteProduct.id;
                        setCartItems((prev) => prev.filter((item) => item.id !== deletedId));
                        void loadProducts();
                    }}
                />
            )}

            <section className="salesContent">
                <div className="salesFilters">
                    <div className="salesFiltersGrid">
                        <div className="searchField">
                            <SearchIcon size={18} aria-hidden="true" />
                            <input
                                className="filterInput"
                                placeholder="Caută după titlu..."
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                            />
                        </div>
                        <FilterSelect
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
                        </FilterSelect>
                        <AppButton className="btnReset" variant="ghost" onClick={resetFilters}>
                            Reset filtre
                        </AppButton>
                    </div>
                </div>

                {isLoading && <div className="salesEmpty">Se încarcă produsele...</div>}
                {loadError && <div className="salesEmpty" style={{ color: "red" }}>{loadError}</div>}

                {!isLoading && !loadError && products.length === 0 && (
                    <div className="salesEmpty">Nu există produse pentru filtrele selectate.</div>
                )}

                {!isLoading && !loadError && products.length > 0 && (
                    <div className="salesGrid">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                                onEdit={setEditProduct}
                                onDelete={setDeleteProduct}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
