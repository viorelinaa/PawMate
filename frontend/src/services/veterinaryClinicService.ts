import axios from "axios";
import { apiClient } from "../axios/apiClient";

export interface VeterinaryClinic {
    id: number;
    name: string;
    city: string;
    address: string;
    phone: string;
    services: string[];
    emergency: boolean;
    description: string;
    googleMapsUrl: string;
    appleMapsUrl: string;
    mapEmbedUrl: string;
}

export interface VeterinaryClinicCreatePayload {
    name: string;
    city: string;
    address: string;
    phone: string;
    services: string[];
    emergency: boolean;
    description: string;
    googleMapsUrl: string;
    appleMapsUrl: string;
    mapEmbedUrl: string;
}

export type VeterinaryClinicUpdatePayload = VeterinaryClinicCreatePayload;

export interface VeterinaryClinicQuery {
    search?: string;
    city?: string;
    onlyEmergency?: boolean;
    sortBy?: "name" | "city";
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

export async function getVeterinaryClinics(query?: VeterinaryClinicQuery): Promise<VeterinaryClinic[]> {
    try {
        const { data } = await apiClient.get<VeterinaryClinic[]>("/veterinary-clinics/list", { params: query });
        return data.map(normalizeVeterinaryClinic);
    } catch (err) {
        handleError(err, "Nu s-au putut incarca datele.");
    }
}

export async function createVeterinaryClinic(payload: VeterinaryClinicCreatePayload): Promise<void> {
    try {
        await apiClient.post("/veterinary-clinics/create", payload);
    } catch (err) {
        handleError(err, "Nu s-a putut adăuga clinica veterinară.");
    }
}

export async function updateVeterinaryClinic(id: number, payload: VeterinaryClinicUpdatePayload): Promise<VeterinaryClinic> {
    try {
        const { data } = await apiClient.put<VeterinaryClinic>(`/veterinary-clinics/${id}`, payload);
        return normalizeVeterinaryClinic(data);
    } catch (err) {
        handleError(err, "Nu s-a putut actualiza clinica veterinară.");
    }
}

export async function deleteVeterinaryClinic(id: number): Promise<void> {
    try {
        await apiClient.delete(`/veterinary-clinics/${id}`);
    } catch (err) {
        handleError(err, "Nu s-a putut șterge clinica veterinară.");
    }
}

function normalizeVeterinaryClinic(clinic: VeterinaryClinic): VeterinaryClinic {
    return {
        ...clinic,
        services: Array.isArray(clinic.services) ? clinic.services : [],
        googleMapsUrl: clinic.googleMapsUrl ?? "",
        appleMapsUrl: clinic.appleMapsUrl ?? "",
        mapEmbedUrl: clinic.mapEmbedUrl ?? "",
    };
}
