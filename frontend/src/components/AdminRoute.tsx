import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (!user || !user.isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
