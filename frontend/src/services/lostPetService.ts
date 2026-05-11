import axios from "axios";
import { apiClient } from "../axios/apiClient";

export interface LostPet {
    id: number;
    species: string;
    city: string;
    lostDate: string;
    contact: string;
    description: string;
    isFound: boolean;
}

export interface LostPetPayload {
    species: string;
    city: string;
    lostDate: string;
    contact: string;
    description: string;
}

export interface LostPetUpdatePayload extends LostPetPayload {
    isFound: boolean;
}

export interface LostPetQuery {
    search?: string;
    species?: string;
    city?: string;
    isFound?: boolean;
    sortBy?: "lostDate" | "city";
    sortDirection?: "asc" | "desc";
}

function handleError(err: unknown, fallback: string): never {
    if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data ?? fallback);
    }
    throw new Error(fallback);
}

export async function getLostPets(query?: LostPetQuery): Promise<LostPet[]> {
    try {
        const { data } = await apiClient.get<LostPet[]>("/lost-pets/list", { params: query });
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut incarca datele.");
    }
}

export async function createLostPet(payload: LostPetPayload): Promise<void> {
    try {
        await apiClient.post("/lost-pets/create", payload);
    } catch (err) {
        handleError(err, "Nu s-a putut adăuga anunțul.");
    }
}

export async function updateLostPet(id: number, payload: LostPetUpdatePayload): Promise<void> {
    try {
        await apiClient.put(`/lost-pets/${id}`, payload);
    } catch (err) {
        handleError(err, "Nu s-a putut actualiza anunțul.");
    }
}

export async function deleteLostPet(id: number): Promise<void> {
    try {
        await apiClient.delete(`/lost-pets/${id}`);
    } catch (err) {
        handleError(err, "Nu s-a putut șterge anunțul.");
    }
}
