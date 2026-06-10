import axios from "axios";
import { apiBaseUrl, apiClient } from "../axios/apiClient";

export interface LostPet {
    id: number;
    species: string;
    city: string;
    lostDate: string;
    contact: string;
    description: string;
    isFound: boolean;
    imageUrl?: string | null;
    userId?: number | null;
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
    userId?: number | null;
}

export interface LostPetQuery {
    search?: string;
    species?: string;
    city?: string;
    isFound?: boolean;
    sortBy?: "lostDate" | "city";
    sortDirection?: "asc" | "desc";
}

interface CreateLostPetResponse {
    id: number;
}

interface UploadLostPetImageResponse {
    imageUrl: string;
}

const apiFileBaseUrl = apiBaseUrl.replace(/\/api$/i, "");

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

export function getLostPetImageUrl(imageUrl?: string | null) {
    if (!imageUrl) return "";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return `${apiFileBaseUrl}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
}

export async function getLostPets(query?: LostPetQuery): Promise<LostPet[]> {
    try {
        const { data } = await apiClient.get<LostPet[]>("/lost-pets/list", { params: query });
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut incarca datele.");
    }
}

export async function createLostPet(payload: LostPetPayload): Promise<number> {
    try {
        const { data } = await apiClient.post<CreateLostPetResponse>("/lost-pets/create", payload);
        return data.id;
    } catch (err) {
        handleError(err, "Nu s-a putut adauga anuntul.");
    }
}

export async function uploadLostPetImage(id: number, image: File): Promise<string> {
    try {
        const formData = new FormData();
        formData.append("image", image);

        const { data } = await apiClient.post<UploadLostPetImageResponse>(`/lost-pets/${id}/image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return data.imageUrl;
    } catch (err) {
        handleError(err, "Nu s-a putut incarca poza.");
    }
}

export async function updateLostPet(id: number, payload: LostPetUpdatePayload): Promise<void> {
    try {
        await apiClient.put(`/lost-pets/${id}`, payload);
    } catch (err) {
        handleError(err, "Nu s-a putut actualiza anuntul.");
    }
}

export async function deleteLostPet(id: number): Promise<void> {
    try {
        await apiClient.delete(`/lost-pets/${id}`);
    } catch (err) {
        handleError(err, "Nu s-a putut sterge anuntul.");
    }
}