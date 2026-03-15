import axios from "axios";

const defaultApiBaseUrl = "http://localhost:5088/api";

function normalizeBaseUrl(baseUrl: string) {
    return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

const apiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL ?? defaultApiBaseUrl);

export const apiClient = axios.create({
    baseURL: apiBaseUrl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});
