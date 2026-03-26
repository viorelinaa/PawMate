const API_BASE = "http://localhost:5088/api/pets";

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

export async function getPets(): Promise<Pet[]> {
  const res = await fetch(`${API_BASE}/list`);
  if (!res.ok) throw new Error("Nu s-au putut încărca animalele.");
  return res.json();
}

export async function createPet(data: PetCreatePayload): Promise<void> {
  const res = await fetch(`${API_BASE}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Eroare la adăugarea animalului.");
  }
}

export async function updatePet(id: number, data: PetUpdatePayload): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Eroare la actualizarea animalului.");
  }
}

export async function deletePet(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Eroare la ștergerea animalului.");
  }
}
