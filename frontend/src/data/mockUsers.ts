export type Role = 'admin' | 'user';

export interface MockUser {
  id: string;
  username: string;
  password: string;
  role: Role;
  displayName: string;
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    username: 'admin@pawmate.ro',
    password: 'Admin1234!',
    role: 'admin',
    displayName: 'Administrator PawMate',
  },
  {
    id: '2',
    username: 'user@pawmate.ro',
    password: 'User1234!',
    role: 'user',
    displayName: 'Utilizator PawMate',
  },
];
