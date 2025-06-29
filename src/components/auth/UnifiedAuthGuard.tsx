
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUnifiedAuth, UserRole } from '@/contexts/UnifiedAuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface UnifiedAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredFeature?: string;
  redirectTo?: string;
  fallbackComponent?: React.ReactNode;
}

const UnifiedAuthGuard: React.FC<UnifiedAuthGuardProps> = ({ 
  children, 
  requiredRole,
  requiredFeature,
  redirectTo = '/auth',
  fallbackComponent
}) => {
  const { user, unifiedUser, isLoading, isInitialized, hasRole, canAccess } = useUnifiedAuth();
  const location = useLocation();

  // Show loading while initializing
  if (!isInitialized || isLoading) {
    return <LoadingSpinner />;
  }

  // Not authenticated
  if (!user || !unifiedUser) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role access
  if (requiredRole && !hasRole(requiredRole)) {
    if (fallbackComponent) return <>{fallbackComponent}</>;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Nedostatečná oprávnění</CardTitle>
            <CardDescription>
              Pro přístup k této stránce potřebujete vyšší oprávnění.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Aktuální role: <strong>{unifiedUser.role}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Požadovaná role: <strong>{requiredRole}</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check feature access
  if (requiredFeature && !canAccess(requiredFeature)) {
    if (fallbackComponent) return <>{fallbackComponent}</>;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Funkce není dostupná</CardTitle>
            <CardDescription>
              Tato funkce vyžaduje vyšší úroveň přístupu.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default UnifiedAuthGuard;
