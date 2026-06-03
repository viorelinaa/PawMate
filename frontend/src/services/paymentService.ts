import axios from "axios";
import { apiClient } from "../axios/apiClient";

const PAYPAL_SDK_SCRIPT_ID = "paypal-sdk-script";

export interface PayPalClientConfig {
    clientId: string;
    currency: string;
}

export interface PayPalCreateOrderItem {
    productId: number;
    quantity: number;
}

export interface PayPalCreateOrderResult {
    internalOrderId: number;
    orderId: string;
    status: string;
    currency: string;
    totalAmount: number;
    amount: number;
    approveUrl?: string;
}

export interface PayPalCaptureOrderResult {
    internalOrderId: number;
    orderId: string;
    status: string;
    captureId?: string;
    captureStatus?: string;
    totalAmount: number;
    currency: string;
}

function handleError(err: unknown, fallback: string): never {
    if (axios.isAxiosError(err)) {
        const message =
            typeof err.response?.data === "string"
                ? err.response.data
                : fallback;
        throw new Error(message);
    }

    throw new Error(fallback);
}

export async function getPayPalClientConfig(): Promise<PayPalClientConfig> {
    try {
        const { data } = await apiClient.get<PayPalClientConfig>("/paypal/client-config");
        return data;
    } catch (err) {
        handleError(err, "Nu s-a putut încărca configurarea PayPal.");
    }
}

export async function createPayPalOrder(items: PayPalCreateOrderItem[]): Promise<PayPalCreateOrderResult> {
    try {
        const { data } = await apiClient.post<PayPalCreateOrderResult>("/paypal/create-order", {
            items,
        });
        return data;
    } catch (err) {
        handleError(err, "Nu s-a putut crea comanda PayPal.");
    }
}

export async function capturePayPalOrder(orderId: string): Promise<PayPalCaptureOrderResult> {
    try {
        const { data } = await apiClient.post<PayPalCaptureOrderResult>(`/paypal/capture-order/${orderId}`);
        return data;
    } catch (err) {
        handleError(err, "Nu s-a putut confirma plata PayPal.");
    }
}

export function loadPayPalSdk(clientId: string, currency: string): Promise<void> {
    const scriptSrc =
        `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}` +
        `&currency=${encodeURIComponent(currency)}&intent=capture&disable-funding=card,credit`;
    const existingScript = document.getElementById(PAYPAL_SDK_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript?.getAttribute("src") === scriptSrc) {
        if (window.paypal) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            existingScript.addEventListener("load", () => resolve(), { once: true });
            existingScript.addEventListener("error", () => reject(new Error("SDK-ul PayPal nu s-a putut încărca.")), {
                once: true,
            });
        });
    }

    if (existingScript) {
        existingScript.remove();
        window.paypal = undefined;
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.id = PAYPAL_SDK_SCRIPT_ID;
        script.src = scriptSrc;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("SDK-ul PayPal nu s-a putut încărca."));
        document.body.appendChild(script);
    });
}
