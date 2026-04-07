import axios from "axios";
import { apiClient } from "../axios/apiClient";

export type ProfileRole = "user" | "admin";

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: ProfileRole;
    phone: string;
    city: string;
    bio: string;
    address: string;
    createdAt: string;
}

export interface UpdateUserProfilePayload {
    name: string;
    email: string;
    phone: string;
    city: string;
    bio: string;
    address: string;
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

export async function getProfile(userId: number): Promise<UserProfile> {
    try {
        const { data } = await apiClient.get<UserProfile>(`/profile/${userId}`);
        return {
            ...data,
            role: data.role === "admin" ? "admin" : "user",
        };
    } catch (err) {
        handleError(err, "Nu s-a putut incarca profilul.");
    }
}

export async function updateProfile(
    userId: number,
    payload: UpdateUserProfilePayload
): Promise<UserProfile> {
    try {
        const { data } = await apiClient.put<UserProfile>(`/profile/${userId}`, payload);
        return {
            ...data,
            role: data.role === "admin" ? "admin" : "user",
        };
    } catch (err) {
        handleError(err, "Nu s-a putut actualiza profilul.");
    }
}
