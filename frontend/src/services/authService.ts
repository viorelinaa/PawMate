import axios from "axios";
import { apiClient } from "../axios/apiClient";

export type AuthRole = "user" | "admin";
export type AccountStatus = "active" | "offline" | "banned";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    userId: number;
    role: AuthRole;
    name: string;
    email: string;
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

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
    try {
        const { data } = await apiClient.post<LoginResponse>("/session/auth", payload);
        return {
            token: data.token,
            userId: data.userId,
            role: data.role === "admin" ? "admin" : "user",
            name: data.name,
            email: data.email,
        };
    } catch (err) {
        handleError(err, "Nu s-a putut realiza autentificarea.");
    }
}

export async function registerUser(payload: RegisterPayload): Promise<void> {
    try {
        await apiClient.post("/reg/register", payload);
    } catch (err) {
        handleError(err, "Nu s-a putut crea contul.");
    }
}

export async function markSessionActive(userId: number): Promise<void> {
    try {
        await apiClient.post(`/session/active/${userId}`);
    } catch (err) {
        handleError(err, "Nu s-a putut actualiza sesiunea utilizatorului.");
    }
}

export async function logoutUser(userId: number): Promise<void> {
    try {
        await apiClient.post(`/session/logout/${userId}`);
    } catch (err) {
        handleError(err, "Nu s-a putut inchide sesiunea utilizatorului.");
    }
}
