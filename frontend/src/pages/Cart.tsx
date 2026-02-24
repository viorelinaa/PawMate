import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Cart.css";
import { paths } from "../routes/paths";

type Product = {
    id: string;
    name: string;
    category: string;
    description: string;
    price: string;
};

function extractPriceNumber(price: string) {
    const cleaned = price.replace(",", ".").replace(/[^\d.]/g, "");
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
}

const CART_KEY = "pawmate_cart";

export default function Cart() {
    const location = useLocation();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState<Product[]>(() => {
        if (location.state?.cartItems) return location.state.cartItems;
        try {
            const saved = localStorage.getItem(CART_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    function removeItem(productId: string) {
        setCartItems((prev) => prev.filter((p) => p.id !== productId));
    }

    const grouped = cartItems.reduce<Record<string, { product: Product; qty: number }>>((acc, product) => {
        if (!acc[product.id]) {
            acc[product.id] = { product, qty: 0 };
        }
        acc[product.id].qty += 1;
        return acc;
    }, {});

    const groupedList = Object.values(grouped);
    const total = cartItems.reduce((sum, p) => sum + extractPriceNumber(p.price), 0);

    return (
        <div className="cartPage">
            <section className="cartHero">
                <div className="cartCloud cc1" />
                <div className="cartCloud cc2" />
                <span className="cartPaw cp1">🐾</span>
                <span className="cartPaw cp2">🐾</span>
                <span className="cartPaw cp3">🐾</span>
                <span
                    className="cartPaw"
                    style={{ top: "28px", left: "140px", transform: "rotate(8deg)", fontSize: "20px" }}
                >
                    🐾
                </span>
                <span
                    className="cartPaw"
                    style={{ bottom: "78px", right: "140px", transform: "rotate(-12deg)", fontSize: "22px" }}
                >
                    🐾
                </span>
                <div className="cartHeroInner">
                    <h1 className="cartTitle">Coșul meu</h1>
                    <p className="cartSub">
                        {cartItems.length === 0
                            ? "Coșul este gol."
                            : `${cartItems.length} produs${cartItems.length !== 1 ? "e" : ""} adăugate`}
                    </p>
                </div>
            </section>

            <section className="cartContent">
                {groupedList.length === 0 ? (
                    <div className="cartEmpty">
                        <p className="cartEmptyText">Nu ai niciun produs în coș.</p>
                        <button type="button" className="cartBackBtn" onClick={() => navigate(paths.vanzari)}>
                            ← Înapoi la vânzări
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="cartItems">
                            {groupedList.map(({ product, qty }) => {
                                const unitPrice = extractPriceNumber(product.price);
                                return (
                                    <div key={product.id} className="cartItem">
                                        <div className="cartItemInfo">
                                            <h3 className="cartItemName">{product.name}</h3>
                                            <span className="cartItemCategory">{product.category}</span>
                                            <span className="cartItemUnitPrice">{product.price} / buc.</span>
                                        </div>
                                        <div className="cartItemRight">
                                            <span className="cartItemQty">×{qty}</span>
                                            <span className="cartItemPrice">
                                                {(unitPrice * qty).toFixed(0)} MDL
                                            </span>
                                            <button
                                                type="button"
                                                className="cartItemRemove"
                                                onClick={() => removeItem(product.id)}
                                                aria-label={`Șterge ${product.name}`}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="cartTotal">
                            <span className="cartTotalLabel">Total</span>
                            <span className="cartTotalAmount">{total.toFixed(0)} MDL</span>
                        </div>

                        <div className="cartActions">
                            <button
                                type="button"
                                className="cartBackBtn"
                                onClick={() => navigate(paths.vanzari)}
                            >
                                ← Înapoi la vânzări
                            </button>
                            <button
                                type="button"
                                className="cartOrderBtn"
                                onClick={() => alert("Comandă plasată! (mock)")}
                            >
                                Plasează comanda
                            </button>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
