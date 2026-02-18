import { createContext, useContext, useState, type ReactNode } from 'react';
import { mockUsers } from '../data/mockUsers';
import type { MockUser, Role } from '../data/mockUsers';

interface AuthContextType {
  currentUser: MockUser | null;
  role: Role | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);

  const login = (username: string, password: string): boolean => {
    const found = mockUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setCurrentUser(found);
      sessionStorage.setItem('pawmate_role', found.role);
      sessionStorage.setItem('pawmate_uid', found.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('pawmate_role');
    sessionStorage.removeItem('pawmate_uid');
  };

  const isAdmin = () => currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, role: currentUser?.role ?? null, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth trebuie folosit în interiorul AuthProvider');
  return ctx;
}
