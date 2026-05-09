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
    lastLoginAt: string | null;
    lastActiveAt: string | null;
    loginCount: number;
    isEmailVerified: boolean;
    hasPhone: boolean;
    hasCity: boolean;
    blogPostsCount: number;
    petsAddedCount: number | null;
    lostPetsPublishedCount: number | null;
    adoptionRequestsCount: number;
    lastActivityAt: string | null;
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
            lastLoginAt: user.lastLoginAt ?? null,
            lastActiveAt: user.lastActiveAt ?? null,
            loginCount: user.loginCount ?? 0,
            isEmailVerified: Boolean(user.isEmailVerified),
            hasPhone: Boolean(user.hasPhone),
            hasCity: Boolean(user.hasCity),
            blogPostsCount: user.blogPostsCount ?? 0,
            petsAddedCount: user.petsAddedCount ?? null,
            lostPetsPublishedCount: user.lostPetsPublishedCount ?? null,
            adoptionRequestsCount: user.adoptionRequestsCount ?? 0,
            lastActivityAt: user.lastActivityAt ?? null,
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
            lastLoginAt: data.lastLoginAt ?? null,
            lastActiveAt: data.lastActiveAt ?? null,
            loginCount: data.loginCount ?? 0,
            isEmailVerified: Boolean(data.isEmailVerified),
            hasPhone: Boolean(data.hasPhone),
            hasCity: Boolean(data.hasCity),
            blogPostsCount: data.blogPostsCount ?? 0,
            petsAddedCount: data.petsAddedCount ?? null,
            lostPetsPublishedCount: data.lostPetsPublishedCount ?? null,
            adoptionRequestsCount: data.adoptionRequestsCount ?? 0,
            lastActivityAt: data.lastActivityAt ?? null,
            selectedAvatar: data.selectedAvatar ?? null,
        };
    } catch (err) {
        handleError(err, "Nu s-a putut actualiza statutul utilizatorului.");
    }
}
