import axios from "axios";
import { apiClient } from "../axios/apiClient";

export interface Sitter {
    id: number;
    name: string;
    city: string;
    services: string;
    pricePerDay: number;
    description: string;
}

export interface SitterCreatePayload {
    name: string;
    city: string;
    services: string;
    pricePerDay: number;
    description: string;
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

export async function getSitters(): Promise<Sitter[]> {
    try {
        const { data } = await apiClient.get<Sitter[]>("/sitters/list");
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut încărca sitterii.");
    }
}

export async function createSitter(payload: SitterCreatePayload): Promise<void> {
    try {
        await apiClient.post("/sitters/create", payload);
    } catch (err) {
        handleError(err, "Nu s-a putut adăuga profilul sitter.");
    }
}
