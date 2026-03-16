import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="app-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="flex flex-col items-center gap-4">
          <div style={{ width: '3rem', height: '3rem', border: '3px solid rgba(249, 115, 22, 0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} className="animate-spin" />
          <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to register but save the current location they were trying to go to
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
