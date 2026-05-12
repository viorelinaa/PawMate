import axios from "axios";
import { apiClient } from "../axios/apiClient";

export interface EventItem {
    id: number;
    title: string;
    description: string;
    location: string;
    date: string;
}

export interface EventCreatePayload {
    title: string;
    description: string;
    location: string;
    date: string;
}

export interface EventUpdatePayload {
    title: string;
    description: string;
    location: string;
    date: string;
}

export interface EventQuery {
    search?: string;
    location?: string;
    sortBy?: "title" | "date";
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

export async function getEvents(query?: EventQuery): Promise<EventItem[]> {
    try {
        const { data } = await apiClient.get<EventItem[]>("/events/list", { params: query });
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut incarca datele.");
    }
}

export async function createEvent(payload: EventCreatePayload): Promise<void> {
    try {
        await apiClient.post("/events/create", payload);
    } catch (err) {
        handleError(err, "Nu s-a putut adăuga evenimentul.");
    }
}

export async function updateEvent(id: number, payload: EventUpdatePayload): Promise<void> {
    try {
        await apiClient.put(`/events/${id}`, payload);
    } catch (err) {
        handleError(err, "Nu s-a putut actualiza evenimentul.");
    }
}

export async function deleteEvent(id: number): Promise<void> {
    try {
        await apiClient.delete(`/events/${id}`);
    } catch (err) {
        handleError(err, "Nu s-a putut șterge evenimentul.");
    }
}
