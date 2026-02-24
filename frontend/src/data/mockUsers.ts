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
  {
    id: '3',
    username: 'ana.ionescu@gmail.com',
    password: 'User1234!',
    role: 'user',
    displayName: 'Ana Ionescu',
    firstName: 'Ana',
    lastName: 'Ionescu',
    phone: '+373 69 234 567',
    address: 'Chișinău, Botanica',
    joinedAt: '2024-01-10',
    adoptedPets: [
      { id: 'p3', name: 'Luna', species: 'pisică', breed: 'Persană', adoptedDate: '2024-02-14' },
    ],
    activityLog: [
      { id: 'a1', type: 'adoptie',     description: 'Ai adoptat pisica Luna',            date: '2024-02-14' },
      { id: 'a2', type: 'donatie',     description: 'Donație de 200 MDL către adăpost',  date: '2024-03-01' },
      { id: 'a3', type: 'voluntariat', description: 'Voluntariat la evenimentul PawDay', date: '2024-04-05' },
    ],
  },
  {
    id: '4',
    username: 'vlad.rusu@yahoo.com',
    password: 'User1234!',
    role: 'user',
    displayName: 'Vlad Rusu',
    firstName: 'Vlad',
    lastName: 'Rusu',
    phone: '+373 60 345 678',
    address: 'Bălți, str. Independenței 12',
    joinedAt: '2023-11-22',
    adoptedPets: [],
    activityLog: [
      { id: 'a1', type: 'donatie',     description: 'Donație de 100 MDL',                date: '2023-12-10' },
      { id: 'a2', type: 'postare',     description: 'Ai publicat un anunț pierdut',       date: '2024-01-15' },
    ],
  },
  {
    id: '5',
    username: 'elena.munteanu@mail.ru',
    password: 'User1234!',
    role: 'user',
    displayName: 'Elena Munteanu',
    firstName: 'Elena',
    lastName: 'Munteanu',
    phone: '+373 79 456 789',
    address: 'Cahul, str. Victoriei 5',
    joinedAt: '2024-05-03',
    adoptedPets: [
      { id: 'p4', name: 'Rex',   species: 'câine', breed: 'Ciobănesc German', adoptedDate: '2024-06-20' },
      { id: 'p5', name: 'Pufi',  species: 'pisică', breed: 'Maine Coon',      adoptedDate: '2024-07-11' },
      { id: 'p6', name: 'Bobi',  species: 'câine', breed: 'Bichon',           adoptedDate: '2024-09-01' },
    ],
    activityLog: [
      { id: 'a1', type: 'adoptie',     description: 'Ai adoptat câinele Rex',            date: '2024-06-20' },
      { id: 'a2', type: 'adoptie',     description: 'Ai adoptat pisica Pufi',            date: '2024-07-11' },
      { id: 'a3', type: 'voluntariat', description: 'Voluntariat — campanie de sterilizare', date: '2024-08-05' },
      { id: 'a4', type: 'adoptie',     description: 'Ai adoptat câinele Bobi',           date: '2024-09-01' },
      { id: 'a5', type: 'donatie',     description: 'Donație de 500 MDL',                date: '2024-10-12' },
    ],
  },
  {
    id: '6',
    username: 'andrei.popa@outlook.com',
    password: 'User1234!',
    role: 'user',
    displayName: 'Andrei Popa',
    firstName: 'Andrei',
    lastName: 'Popa',
    phone: '+373 69 567 890',
    address: 'Orhei, str. Ștefan cel Mare 3',
    joinedAt: '2024-07-18',
    adoptedPets: [],
    activityLog: [
      { id: 'a1', type: 'postare',     description: 'Ai publicat 2 anunțuri pierdute',   date: '2024-08-01' },
    ],
  },
];