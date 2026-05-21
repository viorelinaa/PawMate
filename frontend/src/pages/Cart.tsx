import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Cart.css";
import { paths } from "../routes/paths";
import type { Product } from "../services/productService";
import {
    capturePayPalOrder,
    createPayPalOrder,
    getPayPalClientConfig,
    loadPayPalSdk,
} from "../services/paymentService";

const CART_KEY = "pawmate_cart";

export default function Cart() {
    const location = useLocation();
    const navigate = useNavigate();
    const paypalContainerRef = useRef<HTMLDivElement | null>(null);

    const [cartItems, setCartItems] = useState<Product[]>(() => {
        if (location.state?.cartItems) return location.state.cartItems as Product[];
        try {
            const saved = localStorage.getItem(CART_KEY);
            if (!saved) return [];
            const parsed = JSON.parse(saved) as Product[];
            if (!Array.isArray(parsed) || parsed.some((p) => typeof p.price !== "number" || !p.title)) {
                localStorage.removeItem(CART_KEY);
                return [];
            }
            return parsed;
        } catch {
            return [];
        }
    });
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
    const [isPayPalLoading, setIsPayPalLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    function removeItem(productId: number) {
        setCartItems((prev) => {
            const idx = prev.findIndex((p) => p.id === productId);
            if (idx === -1) return prev;
            return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        });
    }

    const grouped = cartItems.reduce<Record<number, { product: Product; qty: number }>>((acc, product) => {
        if (!acc[product.id]) {
            acc[product.id] = { product, qty: 0 };
        }
        acc[product.id].qty += 1;
        return acc;
    }, {});

    const groupedList = Object.values(grouped);
    const total = cartItems.reduce((sum, p) => sum + Number(p.price), 0);

    useEffect(() => {
        if (groupedList.length === 0 || total <= 0) {
            return;
        }

        let isCancelled = false;
        const container = paypalContainerRef.current;

        async function renderPayPalButtons() {
            setIsPayPalLoading(true);
            setPaymentError(null);

            try {
                const config = await getPayPalClientConfig();
                await loadPayPalSdk(config.clientId, config.currency);

                if (isCancelled || !container || !window.paypal) {
                    return;
                }

                container.innerHTML = "";
                const buttons = window.paypal.Buttons({
                    style: {
                        layout: "vertical",
                        color: "gold",
                        shape: "pill",
                        label: "paypal",
                    },
                    createOrder: async () => {
                        const order = await createPayPalOrder(total);
                        return order.orderId;
                    },
                    onApprove: async (data) => {
                        if (!data.orderID) {
                            throw new Error("PayPal nu a returnat id-ul comenzii.");
                        }

                        setPaymentMessage("Se confirmă plata PayPal...");
                        const result = await capturePayPalOrder(data.orderID);

                        if (result.status !== "COMPLETED" && result.captureStatus !== "COMPLETED") {
                            throw new Error("Plata PayPal nu a fost finalizată.");
                        }

                        setCartItems([]);
                        localStorage.removeItem(CART_KEY);
                        setPaymentError(null);
                        setPaymentMessage("Plata PayPal a fost confirmată. Coșul a fost golit.");
                    },
                    onCancel: () => {
                        setPaymentMessage(null);
                    },
                    onError: () => {
                        setPaymentMessage(null);
                        setPaymentError("Plata PayPal nu a putut fi finalizată.");
                    },
                });

                if (buttons.isEligible && !buttons.isEligible()) {
                    setPaymentError("PayPal nu este disponibil pentru această plată.");
                    return;
                }

                await buttons.render(container);
            } catch (err) {
                if (!isCancelled) {
                    setPaymentError(err instanceof Error ? err.message : "PayPal nu este disponibil.");
                }
            } finally {
                if (!isCancelled) {
                    setIsPayPalLoading(false);
                }
            }
        }

        void renderPayPalButtons();

        return () => {
            isCancelled = true;
            if (container) {
                container.innerHTML = "";
            }
        };
    }, [groupedList.length, total]);

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
                    <h1 className="cartTitle heroTitle">Coșul meu</h1>
                    <p className="cartSub heroSubtitle">
                        {cartItems.length === 0
                            ? "Coșul este gol."
                            : `${cartItems.length} produs${cartItems.length !== 1 ? "e" : ""} adăugate`}
                    </p>
                </div>
            </section>

            <section className="cartContent">
                {paymentMessage && <div className="cartPaymentSuccess">{paymentMessage}</div>}

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
                            {groupedList.map(({ product, qty }) => (
                                <div key={product.id} className="cartItem">
                                    <div className="cartItemInfo">
                                        <h3 className="cartItemName">{product.title}</h3>
                                        <span className="cartItemCategory">{product.category}</span>
                                        <span className="cartItemUnitPrice">{product.price} MDL / buc.</span>
                                    </div>
                                    <div className="cartItemRight">
                                        <span className="cartItemQty">×{qty}</span>
                                        <span className="cartItemPrice">
                                            {(Number(product.price) * qty).toFixed(0)} MDL
                                        </span>
                                        <button
                                            type="button"
                                            className="cartItemRemove"
                                            onClick={() => removeItem(product.id)}
                                            aria-label={`Șterge ${product.title}`}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
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
                            <div className="cartPayPalArea">
                                {isPayPalLoading && (
                                    <div className="cartPaymentNotice">Se pregătește PayPal...</div>
                                )}
                                {paymentError && <div className="cartPaymentError">{paymentError}</div>}
                                <div ref={paypalContainerRef} className="cartPayPalButtons" />
                            </div>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
