import axios from "axios";
import { apiClient } from "../axios/apiClient";

export type AdoptionStatus = "pending" | "accepted" | "rejected";

export interface AdoptionRequestPayload {
    petId: number;
    applicantName: string;
    applicantPhone: string;
    message: string;
    animalExperience: string;
    livingConditions: string;
}

export interface AdoptionRequest {
    id: number;
    petId: number;
    userId: number;
    ownerUserId?: number | null;
    status: AdoptionStatus;
    createdAt: string;
    reviewedAt?: string | null;
    applicantName: string;
    applicantPhone: string;
    message: string;
    animalExperience: string;
    livingConditions: string;
    applicantUserName: string;
    applicantEmail: string;
    petName: string;
    petSpecies: string;
    petCity: string;
    petImageUrl?: string | null;
}

interface CreateAdoptionResponse {
    id: number;
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

export async function createAdoptionRequest(payload: AdoptionRequestPayload): Promise<number> {
    try {
        const { data } = await apiClient.post<CreateAdoptionResponse>("/adoptions/create", payload);
        return data.id;
    } catch (err) {
        handleError(err, "Nu s-a putut trimite cererea de adoptie.");
    }
}

export async function getMyAdoptionRequests(): Promise<AdoptionRequest[]> {
    try {
        const { data } = await apiClient.get<AdoptionRequest[]>("/adoptions/mine");
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut incarca cererile tale de adoptie.");
    }
}

export async function getReceivedAdoptionRequests(): Promise<AdoptionRequest[]> {
    try {
        const { data } = await apiClient.get<AdoptionRequest[]>("/adoptions/received");
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut incarca cererile primite.");
    }
}

export async function updateAdoptionRequestStatus(id: number, status: Exclude<AdoptionStatus, "pending">): Promise<AdoptionRequest> {
    try {
        const { data } = await apiClient.put<AdoptionRequest>(`/adoptions/${id}/status`, { status });
        return data;
    } catch (err) {
        handleError(err, "Nu s-a putut actualiza statusul cererii.");
    }
}