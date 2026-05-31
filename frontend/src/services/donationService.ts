import axios from "axios";
import { apiClient } from "../axios/apiClient";

export interface DonationOrg {
    id: number;
    name: string;
    city: string;
    type: string;
    donationLink: string;
    description: string;
}

export interface DonationOrgCreatePayload {
    name: string;
    city: string;
    type: string;
    donationLink: string;
    description: string;
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

export async function getDonationOrgs(): Promise<DonationOrg[]> {
    try {
        const { data } = await apiClient.get<DonationOrg[]>("/donations/list");
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut încărca organizațiile.");
    }
}

export async function createDonationOrg(payload: DonationOrgCreatePayload): Promise<void> {
    try {
        await apiClient.post("/donations/create", payload);
    } catch (err) {
        handleError(err, "Nu s-a putut adăuga organizația.");
    }
}

export async function updateDonationOrg(id: number, payload: DonationOrgCreatePayload): Promise<void> {
    try {
        await apiClient.put(`/donations/${id}`, payload);
    } catch (err) {
        handleError(err, "Nu s-a putut actualiza organizația.");
    }
}

export async function deleteDonationOrg(id: number): Promise<void> {
    try {
        await apiClient.delete(`/donations/${id}`);
    } catch (err) {
        handleError(err, "Nu s-a putut șterge organizația.");
    }
}
