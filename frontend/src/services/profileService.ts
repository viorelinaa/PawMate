import axios from "axios";
import { apiClient } from "../axios/apiClient";
import type { QuizResultSummary } from "./quizService";

export type ProfileRole = "user" | "admin";

export interface ProfileAvatarOption {
    id: number;
    title: string;
    imageUrl: string;
}

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
    selectedAvatar: ProfileAvatarOption | null;
    latestQuizResult: QuizResultSummary | null;
    quizResults: QuizResultSummary[];
}

export interface UpdateUserProfilePayload {
    name: string;
    email: string;
    phone: string;
    city: string;
    bio: string;
    address: string;
}

export interface CreateProfileAvatarPayload {
    title: string;
    imageUrl: string;
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
            selectedAvatar: data.selectedAvatar ?? null,
            latestQuizResult: data.latestQuizResult ?? null,
            quizResults: data.quizResults ?? [],
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
            selectedAvatar: data.selectedAvatar ?? null,
            latestQuizResult: data.latestQuizResult ?? null,
            quizResults: data.quizResults ?? [],
        };
    } catch (err) {
        handleError(err, "Nu s-a putut actualiza profilul.");
    }
}

export async function getProfileAvatarOptions(): Promise<ProfileAvatarOption[]> {
    try {
        const { data } = await apiClient.get<ProfileAvatarOption[]>("/profile/avatars");
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut incarca avatarurile disponibile.");
    }
}

export async function createProfileAvatarOption(
    payload: CreateProfileAvatarPayload
): Promise<ProfileAvatarOption> {
    try {
        const { data } = await apiClient.post<ProfileAvatarOption>("/profile/avatars", payload);
        return data;
    } catch (err) {
        handleError(err, "Nu s-a putut adauga avatarul.");
    }
}

export async function updateProfileAvatar(
    userId: number,
    avatarId: number
): Promise<UserProfile> {
    try {
        const { data } = await apiClient.put<UserProfile>(`/profile/${userId}/avatar`, { avatarId });
        return {
            ...data,
            role: data.role === "admin" ? "admin" : "user",
            selectedAvatar: data.selectedAvatar ?? null,
            latestQuizResult: data.latestQuizResult ?? null,
            quizResults: data.quizResults ?? [],
        };
    } catch (err) {
        handleError(err, "Nu s-a putut actualiza poza de profil.");
    }
}
