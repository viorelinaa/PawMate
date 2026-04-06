import axios from "axios";
import { apiClient } from "../axios/apiClient";

export interface PetCreatePayload {
  name: string;
  species: string;
  city: string;
  age: string;
  size: string;
  vaccinated: boolean;
  sterilized: boolean;
  description: string;
}

export interface PetUpdatePayload extends PetCreatePayload {}

export interface Pet {
  id: number;
  name: string;
  species: string;
  city: string;
  age: string;
  size: string;
  vaccinated: boolean;
  sterilized: boolean;
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

export async function getPets(): Promise<Pet[]> {
  try {
    const { data } = await apiClient.get<Pet[]>("/pets/list");
    return data;
  } catch (err) {
    handleError(err, "Nu s-au putut încărca animalele.");
  }
}

export async function createPet(data: PetCreatePayload): Promise<void> {
  try {
    await apiClient.post("/pets/create", data);
  } catch (err) {
    handleError(err, "Eroare la adăugarea animalului.");
  }
}

export async function updatePet(id: number, data: PetUpdatePayload): Promise<void> {
  try {
    await apiClient.put(`/pets/${id}`, data);
  } catch (err) {
    handleError(err, "Eroare la actualizarea animalului.");
  }
}

export async function deletePet(id: number): Promise<void> {
  try {
    await apiClient.delete(`/pets/${id}`);
  } catch (err) {
    handleError(err, "Eroare la ștergerea animalului.");
  }
}
