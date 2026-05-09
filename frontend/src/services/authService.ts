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

interface LoginTokenResponse {
    token: string;
}

interface JwtPayload {
    nameid?: string;
    unique_name?: string;
    role?: string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
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

function decodeJwtPayload(token: string): JwtPayload {
    const payload = token.split(".")[1];
    if (!payload) {
        throw new Error("Token JWT invalid.");
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(base64.length + ((4 - base64.length % 4) % 4), "=");
    return JSON.parse(atob(paddedBase64)) as JwtPayload;
}

function getJwtClaim(payload: JwtPayload, ...keys: Array<keyof JwtPayload>) {
    for (const key of keys) {
        const value = payload[key];
        if (typeof value === "string" && value.trim()) {
            return value;
        }
    }

    return "";
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
    try {
        const { data } = await apiClient.post<LoginTokenResponse>("/session/auth", payload);
        const tokenPayload = decodeJwtPayload(data.token);
        const userId = Number(getJwtClaim(
            tokenPayload,
            "nameid",
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ));
        const role = getJwtClaim(
            tokenPayload,
            "role",
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        );
        const name = getJwtClaim(
            tokenPayload,
            "unique_name",
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        );

        return {
            token: data.token,
            userId,
            role: role === "admin" ? "admin" : "user",
            name,
            email: payload.email,
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
