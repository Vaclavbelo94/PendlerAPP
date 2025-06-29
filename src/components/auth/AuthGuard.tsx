
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUnifiedAuth, UserRole } from '@/contexts/UnifiedAuthContext';
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
  const { user, unifiedUser, isLoading, hasRole } = useUnifiedAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Not authenticated
  if (!user || !unifiedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Suspended users
  if (unifiedUser.status === 'suspended') {
    return <Navigate to="/suspended" replace />;
  }

  // Setup required but not completed
  if (unifiedUser.status === 'pending_setup' && !requireSetup) {
    if (unifiedUser.isDHLUser) {
      return <Navigate to="/dhl-setup" replace />;
    }
    return <Navigate to="/setup" replace />;
  }

  // Role-based access control
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Custom redirect
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
