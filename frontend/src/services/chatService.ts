import axios from "axios";
import { apiClient } from "../axios/apiClient";

export interface ChatConversation {
    id: number;
    clientUserId: number;
    clientName: string;
    sitterId: number;
    sitterName: string;
    sitterUserId: number;
    sitterUserName: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
}

export interface ChatMessage {
    id: number;
    conversationId: number;
    senderUserId: number;
    senderName: string;
    body: string;
    createdAt: string;
    isMine: boolean;
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

export async function getConversations(): Promise<ChatConversation[]> {
    try {
        const { data } = await apiClient.get<ChatConversation[]>("/chats");
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut incarca conversatiile.");
    }
}

export async function startConversation(sitterId: number): Promise<ChatConversation> {
    try {
        const { data } = await apiClient.post<ChatConversation>("/chats/start", { sitterId });
        return data;
    } catch (err) {
        handleError(err, "Nu s-a putut porni conversatia.");
    }
}

export async function getMessages(conversationId: number): Promise<ChatMessage[]> {
    try {
        const { data } = await apiClient.get<ChatMessage[]>(`/chats/${conversationId}/messages`);
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut incarca mesajele.");
    }
}

export async function sendMessage(conversationId: number, body: string): Promise<ChatMessage> {
    try {
        const { data } = await apiClient.post<ChatMessage>(`/chats/${conversationId}/messages`, { body });
        return data;
    } catch (err) {
        handleError(err, "Nu s-a putut trimite mesajul.");
    }
}