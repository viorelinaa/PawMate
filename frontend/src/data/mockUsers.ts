export type Role = 'admin' | 'user';

export interface AdoptedPet {
  id: string;
  name: string;
  species: 'câine' | 'pisică' | 'alt';
  breed: string;
  adoptedDate: string;
}

export interface ActivityItem {
  id: string;
  type: 'adoptie' | 'donatie' | 'voluntariat' | 'postare';
  description: string;
  date: string;
}

export interface MockUser {
  id: string;
  username: string;
  password: string;
  role: Role;
  displayName: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  joinedAt: string;
  adoptedPets: AdoptedPet[];
  activityLog: ActivityItem[];
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    username: 'admin@pawmate.ro',
    password: 'Admin1234!',
    role: 'admin',
    displayName: 'Administrator PawMate',
    firstName: 'Maria',
    lastName: 'Admin',
    phone: '+373 60 000 001',
    address: 'Chișinău, Centru',
    joinedAt: '2023-01-01',
    adoptedPets: [],
    activityLog: [
      { id: 'a1', type: 'postare', description: 'Ai adăugat 3 animale noi',       date: '2024-09-01' },
      { id: 'a2', type: 'postare', description: 'Ai aprobat 5 cereri de adopție', date: '2024-09-05' },
    ],
  },
  {
    id: '2',
    username: 'user@pawmate.ro',
    password: 'User1234!',
    role: 'user',
    displayName: 'Utilizator PawMate',
    firstName: 'Ion',
    lastName: 'Popescu',
    phone: '+373 69 123 456',
    address: 'Chișinău, str. Exemplu 1',
    joinedAt: '2024-03-15',
    adoptedPets: [
      { id: 'p1', name: 'Buddy', species: 'câine', breed: 'Golden Retriever', adoptedDate: '2024-05-10' },
      { id: 'p2', name: 'Mișu',  species: 'pisică', breed: 'Siameză',         adoptedDate: '2024-08-22' },
    ],
    activityLog: [
      { id: 'a1', type: 'adoptie',     description: 'Ai adoptat câinele Buddy',         date: '2024-05-10' },
      { id: 'a2', type: 'donatie',     description: 'Donație de 150 MDL către adăpost',  date: '2024-06-01' },
      { id: 'a3', type: 'voluntariat', description: 'Voluntariat la evenimentul PawDay', date: '2024-07-20' },
      { id: 'a4', type: 'adoptie',     description: 'Ai adoptat pisica Mișu',            date: '2024-08-22' },
    ],
  },
];