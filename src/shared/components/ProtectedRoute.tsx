import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/provider/AuthProvider';
import LoadingSpinner from '@/shared/components/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return fallback ?? <LoadingSpinner message='Checking session...' />;

  if (!user) return <Navigate to='/login' replace />;

  return <>{children}</>;
};
