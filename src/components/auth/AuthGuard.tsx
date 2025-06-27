
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole, UserStatus } from '@/types/auth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireSetup?: boolean;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole, 
  requireSetup = false,
  redirectTo 
}) => {
  const { user, unifiedUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Not authenticated
  if (!user || !unifiedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Suspended users
  if (unifiedUser.status === UserStatus.SUSPENDED) {
    return <Navigate to="/suspended" replace />;
  }

  // Setup required but not completed
  if (unifiedUser.status === UserStatus.PENDING_SETUP && !requireSetup) {
    if (unifiedUser.isDHLEmployee) {
      return <Navigate to="/dhl-setup" replace />;
    }
    return <Navigate to="/setup" replace />;
  }

  // Role-based access control
  if (requiredRole && !unifiedUser.canAccess?.(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Custom redirect
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
