import { type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: ReactNode;
}

export function AdminOnly({ children }: Props) {
  const { isAdmin } = useAuth();
  if (!isAdmin()) return null;
  return <>{children}</>;
}
