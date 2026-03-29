import axios from "axios";

const BASE = "http://localhost:5088/api/lost-pets";

export interface LostPet {
    id: number;
    species: string;
    city: string;
    lostDate: string;
    contact: string;
    description: string;
    isFound: boolean;
}

export interface LostPetPayload {
    species: string;
    city: string;
    lostDate: string;
    contact: string;
    description: string;
}

export interface LostPetUpdatePayload extends LostPetPayload {
    isFound: boolean;
}

function handleError(err: unknown, fallback: string): never {
    if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data ?? fallback);
    }
    throw new Error(fallback);
}

export async function getLostPets(): Promise<LostPet[]> {
    try {
        const { data } = await axios.get<LostPet[]>(`${BASE}/list`);
        return data;
    } catch (err) {
        handleError(err, "Nu s-au putut încărca anunțurile.");
    }
}

export async function createLostPet(payload: LostPetPayload): Promise<void> {
    try {
        await axios.post(`${BASE}/create`, payload);
    } catch (err) {
        handleError(err, "Nu s-a putut adăuga anunțul.");
    }
}

export async function updateLostPet(id: number, payload: LostPetUpdatePayload): Promise<void> {
    try {
        await axios.put(`${BASE}/${id}`, payload);
    } catch (err) {
        handleError(err, "Nu s-a putut actualiza anunțul.");
    }
}

export async function deleteLostPet(id: number): Promise<void> {
    try {
        await axios.delete(`${BASE}/${id}`);
    } catch (err) {
        handleError(err, "Nu s-a putut șterge anunțul.");
    }
}
