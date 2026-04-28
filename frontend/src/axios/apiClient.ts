import axios from "axios";

const defaultApiBaseUrl = "http://localhost:5088/api";

function normalizeBaseUrl(baseUrl: string) {
    return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

export const apiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL ?? defaultApiBaseUrl);

export const apiClient = axios.create({
    baseURL: apiBaseUrl,
    timeout: 5000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("pawmate_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
