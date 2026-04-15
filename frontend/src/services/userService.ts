import axios from "axios";
import { apiClient } from "../axios/apiClient";

export type AdminUserRole = "user" | "admin";
export type AdminUserStatus = "active" | "offline" | "banned";

export interface AdminUserAvatar {
    id: number;
    title: string;
    imageUrl: string;
}

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: AdminUserRole;
    status: AdminUserStatus;
    createdAt: string;
    selectedAvatar: AdminUserAvatar | null;
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

export async function getUsers(): Promise<AdminUser[]> {
    try {
        const { data } = await apiClient.get<AdminUser[]>("/users/list");
        return data.map((user) => ({
            ...user,
            role: user.role === "admin" ? "admin" : "user",
            status:
                user.status === "active" || user.status === "banned"
                    ? user.status
                    : "offline",
            selectedAvatar: user.selectedAvatar ?? null,
        }));
    } catch (err) {
        handleError(err, "Nu s-a putut incarca lista de utilizatori.");
    }
}

export async function updateUserStatus(
    userId: number,
    status: AdminUserStatus
): Promise<AdminUser> {
    try {
        const { data } = await apiClient.put<AdminUser>(`/users/${userId}/status`, { status });
        return {
            ...data,
            role: data.role === "admin" ? "admin" : "user",
            status:
                data.status === "active" || data.status === "banned"
                    ? data.status
                    : "offline",
            selectedAvatar: data.selectedAvatar ?? null,
        };
    } catch (err) {
        handleError(err, "Nu s-a putut actualiza statutul utilizatorului.");
    }
}
