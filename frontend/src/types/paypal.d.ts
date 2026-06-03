export {};

declare global {
    interface Window {
        paypal?: PayPalNamespace;
    }
}

type PayPalNamespace = {
    Buttons: (options: PayPalButtonsOptions) => PayPalButtons;
};

type PayPalButtons = {
    render: (container: HTMLElement | string) => Promise<void>;
    close?: () => void;
    isEligible?: () => boolean;
};

type PayPalButtonsOptions = {
    style?: {
        layout?: "vertical" | "horizontal";
        color?: "gold" | "blue" | "silver" | "white" | "black";
        shape?: "rect" | "pill";
        label?: "paypal" | "checkout" | "buynow" | "pay";
    };
    createOrder: () => Promise<string>;
    onApprove: (data: PayPalApproveData) => Promise<void>;
    onCancel?: () => void;
    onError?: (err: unknown) => void;
};

type PayPalApproveData = {
    orderID?: string;
};
