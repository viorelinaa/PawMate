import axios from "axios";
import { apiClient } from "../axios/apiClient";

export interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    sellerId: number;
}

export interface ProductCreatePayload {
    title: string;
    description: string;
    category: string;
    price: number;
    sellerId: number;
}

export interface ProductUpdatePayload {
    title: string;
    description: string;
    category: string;
    price: number;
}

export interface ProductQuery {
    search?: string;
    category?: string;
    sortBy?: "title" | "price";
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

export async function getProducts(query?: ProductQuery): Promise<Product[]> {
    try {
        const { data } = await apiClient.get<Product[]>("/marketplace/list", { params: query });
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut incarca datele.");
    }
}

export async function createProduct(payload: ProductCreatePayload): Promise<void> {
    try {
        await apiClient.post("/marketplace/create", payload);
    } catch (err) {
        handleError(err, "Nu s-a putut adăuga produsul.");
    }
}

export async function updateProduct(id: number, payload: ProductUpdatePayload): Promise<void> {
    try {
        await apiClient.put(`/marketplace/${id}`, payload);
    } catch (err) {
        handleError(err, "Nu s-a putut actualiza produsul.");
    }
}

export async function deleteProduct(id: number): Promise<void> {
    try {
        await apiClient.delete(`/marketplace/${id}`);
    } catch (err) {
        handleError(err, "Nu s-a putut șterge produsul.");
    }
}
