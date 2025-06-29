
import React from 'react';
import RouteGuard from './RouteGuard';
import { UserRole } from '@/contexts/UnifiedAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
  feature?: string;
  allowedRoles?: UserRole[];
  publicRoute?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  role,
  feature,
  allowedRoles,
  publicRoute = false
}) => {
  // Public routes don't require authentication
  if (publicRoute) {
    return <>{children}</>;
  }

  return (
    <RouteGuard
      requiredRole={role}
      requiredFeature={feature}
      allowedRoles={allowedRoles}
      requireAuth={true}
      showFallback={true}
    >
      {children}
    </RouteGuard>
  );
};

export default ProtectedRoute;
