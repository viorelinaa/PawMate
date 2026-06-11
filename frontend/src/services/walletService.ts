import axios from "axios";
import { apiClient } from "../axios/apiClient";

export type WithdrawalStatus = "pending" | "approved" | "rejected";
export type WalletTransactionType = "sale_credit" | "withdrawal_request" | "withdrawal_refund";

export interface WalletTransaction {
    id: number;
    orderId?: number | null;
    withdrawalRequestId?: number | null;
    amount: number;
    type: WalletTransactionType;
    description: string;
    createdAt: string;
}

export interface WithdrawalRequest {
    id: number;
    sellerId: number;
    sellerName: string;
    sellerEmail: string;
    destinationPayPalEmail: string;
    amount: number;
    status: WithdrawalStatus;
    adminComment: string;
    requestedAt: string;
    processedAt?: string | null;
    processedByAdminName: string;
}

export interface WalletSummary {
    payPalSandboxEmail: string;
    availableBalance: number;
    pendingWithdrawalBalance: number;
    totalEarned: number;
    totalWithdrawn: number;
    transactions: WalletTransaction[];
    withdrawals: WithdrawalRequest[];
}

export interface WithdrawalDecisionPayload {
    status: Exclude<WithdrawalStatus, "pending">;
    adminComment: string;
}

function handleError(err: unknown, fallback: string): never {
    if (axios.isAxiosError(err)) {
        const message = typeof err.response?.data === "string" ? err.response.data : fallback;
        throw new Error(message);
    }

    throw new Error(fallback);
}

export async function getMyWallet(): Promise<WalletSummary> {
    try {
        const { data } = await apiClient.get<WalletSummary>("/wallet/mine");
        return data;
    } catch (err) {
        handleError(err, "Nu s-a putut incarca portmoneul.");
    }
}

export async function createWithdrawalRequest(amount: number): Promise<WithdrawalRequest> {
    try {
        const { data } = await apiClient.post<WithdrawalRequest>("/wallet/withdrawals", { amount });
        return data;
    } catch (err) {
        handleError(err, "Nu s-a putut trimite cererea de retragere.");
    }
}

export async function updatePayPalSandboxAccount(email: string): Promise<{ email: string }> {
    try {
        const { data } = await apiClient.put<{ email: string }>("/wallet/payout-account", { email });
        return data;
    } catch (err) {
        handleError(err, "Nu s-a putut salva contul PayPal Sandbox.");
    }
}

export async function getWithdrawalRequestsForAdmin(): Promise<WithdrawalRequest[]> {
    try {
        const { data } = await apiClient.get<WithdrawalRequest[]>("/wallet/withdrawals/admin");
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut incarca cererile de retragere.");
    }
}

export async function reviewWithdrawalRequest(
    id: number,
    payload: WithdrawalDecisionPayload
): Promise<WithdrawalRequest> {
    try {
        const { data } = await apiClient.put<WithdrawalRequest>(`/wallet/withdrawals/${id}/decision`, payload);
        return data;
    } catch (err) {
        handleError(err, "Nu s-a putut procesa cererea de retragere.");
    }
}
