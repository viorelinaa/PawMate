import { type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: ReactNode;
}

export function UserOnly({ children }: Props) {
  const { role } = useAuth();
  if (role !== 'user' && role !== 'admin') return null;
  return <>{children}</>;
}
