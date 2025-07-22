import React from 'react';
import { useAuth } from '@/hooks/auth';
import { useCompany } from '@/hooks/useCompany';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredCompany?: 'adecco' | 'randstad' | 'dhl' | null;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredCompany = null,
  allowedRoles = []
}) => {
  const { user, isLoading, unifiedUser } = useAuth();
  const { company } = useCompany();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredCompany && company !== requiredCompany) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && unifiedUser) {
    const hasAllowedRole = allowedRoles.some(role => {
      switch (role) {
        case 'admin':
          return unifiedUser.isAdmin;
        case 'premium':
          return unifiedUser.isPremium;
        case 'dhl':
          return unifiedUser.isDHLEmployee;
        case 'adecco':
          return unifiedUser.isAdeccoEmployee;
        case 'randstad':
          return unifiedUser.isRandstadEmployee;
        default:
          return false;
      }
    });

    if (!hasAllowedRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;