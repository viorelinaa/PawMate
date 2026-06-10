import axios from "axios";
import { apiClient } from "../axios/apiClient";

export interface Sitter {
    id: number;
    name: string;
    city: string;
    services: string;
    pricePerDay: number;
    description: string;
    rating: number;
    ratingCount: number;
    userId?: number | null;
}

export interface SitterCreatePayload {
    name: string;
    city: string;
    services: string;
    pricePerDay: number;
    description: string;
}

export interface SitterQuery {
    search?: string;
    onlyTopRated?: boolean;
    minRating?: number;
    sortBy?: "name" | "price" | "rating";
    sortDirection?: "asc" | "desc";
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

export async function getSitters(query?: SitterQuery): Promise<Sitter[]> {
    try {
        const { data } = await apiClient.get<Sitter[]>("/sitters/list", { params: query });
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut incarca datele.");
    }
}

export interface SitterUpdatePayload {
    name: string;
    city: string;
    services: string;
    pricePerDay: number;
    description: string;
    rating: number;
    userId?: number | null;
}

export interface SitterRatingInfo {
    sitterId: number;
    rating: number;
    ratingCount: number;
    myRating: number;
}

export async function createSitter(payload: SitterCreatePayload): Promise<void> {
    try {
        await apiClient.post("/sitters/create", payload);
    } catch (err) {
        handleError(err, "Nu s-a putut adăuga profilul sitter.");
    }
}

export async function updateSitter(id: number, payload: SitterUpdatePayload): Promise<void> {
    try {
        await apiClient.put(`/sitters/${id}`, payload);
    } catch (err) {
        handleError(err, "Nu s-a putut actualiza profilul sitter.");
    }
}

export async function deleteSitter(id: number): Promise<void> {
    try {
        await apiClient.delete(`/sitters/${id}`);
    } catch (err) {
        handleError(err, "Nu s-a putut șterge profilul sitter.");
    }
}

export async function rateSitter(id: number, rating: number): Promise<SitterRatingInfo> {
    try {
        const { data } = await apiClient.post<SitterRatingInfo>(`/sitters/${id}/rating`, { rating });
        return data;
    } catch (err) {
        handleError(err, "Nu s-a putut salva ratingul.");
    }
}
