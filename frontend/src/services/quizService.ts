import axios from "axios";
import { apiClient } from "../axios/apiClient";

export interface QuizResultSummary {
    id: number;
    animalKey: string;
    animalName: string;
    score: number;
    totalQuestions: number;
    completedAt: string;
}

export interface SaveQuizResultPayload {
    userId: number;
    animalKey: string;
    animalName: string;
    score: number;
    totalQuestions: number;
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

export async function saveQuizResult(payload: SaveQuizResultPayload): Promise<QuizResultSummary> {
    try {
        const { data } = await apiClient.post<QuizResultSummary>("/quiz-results", payload);
        return data;
    } catch (err) {
        handleError(err, "Nu s-a putut salva rezultatul quizului.");
    }
}
