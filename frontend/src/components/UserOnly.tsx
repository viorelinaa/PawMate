import { type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: ReactNode;
}

export function UserOnly({ children }: Props) {
  const { role } = useAuth();
  if (role !== 'user') return null;
  return <>{children}</>;
}
