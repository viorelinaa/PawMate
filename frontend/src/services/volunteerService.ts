import axios from "axios";
import { apiClient } from "../axios/apiClient";

export type VolunteerApplicationStatus = "pending" | "accepted" | "rejected";

export interface VolunteerApplicationPayload {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    age: number;
    experience: string;
    availability: string;
    activities: string[];
    message: string;
}

export interface VolunteerApplication {
    id: number;
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    age: number;
    experience: string;
    availability: string;
    activities: string[];
    message: string;
    status: VolunteerApplicationStatus;
    adminComment: string;
    createdAt: string;
    reviewedAt?: string | null;
    reviewedByAdminName: string;
}

export interface VolunteerApplicationDecisionPayload {
    status: Exclude<VolunteerApplicationStatus, "pending">;
    adminComment: string;
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

export async function createVolunteerApplication(
    payload: VolunteerApplicationPayload
): Promise<VolunteerApplication> {
    try {
        const { data } = await apiClient.post<VolunteerApplication>("/volunteer/applications", payload);
        return data;
    } catch (err) {
        handleError(err, "Nu s-a putut trimite cererea de voluntariat.");
    }
}

export async function getMyVolunteerApplications(): Promise<VolunteerApplication[]> {
    try {
        const { data } = await apiClient.get<VolunteerApplication[]>("/volunteer/applications/mine");
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut incarca cererile tale de voluntariat.");
    }
}

export async function getVolunteerApplicationsForAdmin(): Promise<VolunteerApplication[]> {
    try {
        const { data } = await apiClient.get<VolunteerApplication[]>("/volunteer/applications/admin");
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut incarca cererile de voluntariat pentru admin.");
    }
}

export async function reviewVolunteerApplication(
    id: number,
    payload: VolunteerApplicationDecisionPayload
): Promise<VolunteerApplication> {
    try {
        const { data } = await apiClient.put<VolunteerApplication>(
            `/volunteer/applications/${id}/decision`,
            payload
        );
        return data;
    } catch (err) {
        handleError(err, "Nu s-a putut salva decizia pentru cererea de voluntariat.");
    }
}
