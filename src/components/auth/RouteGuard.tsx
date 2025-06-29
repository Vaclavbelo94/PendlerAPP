
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUnifiedAuth, UserRole } from '@/contexts/UnifiedAuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Lock, Crown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredFeature?: string;
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  fallbackPath?: string;
  showFallback?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requiredRole,
  requiredFeature,
  requireAuth = true,
  allowedRoles = [],
  fallbackPath = '/login',
  showFallback = true
}) => {
  const { user, unifiedUser, isLoading, isInitialized, hasRole, canAccess } = useUnifiedAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Show loading while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && (!user || !unifiedUser)) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check if user is suspended
  if (unifiedUser && unifiedUser.status === 'suspended') {
    if (!showFallback) return <Navigate to="/suspended" replace />;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Účet pozastaven</CardTitle>
            <CardDescription>
              Váš účet byl dočasně pozastaven. Kontaktujte podporu.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Check specific role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    if (!showFallback) return <Navigate to="/unauthorized" replace />;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Přístup odepřen</CardTitle>
            <CardDescription>
              Pro přístup k této stránce potřebujete {requiredRole} oprávnění.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Aktuální role: <strong>{unifiedUser?.role}</strong></p>
              <p>Požadovaná role: <strong>{requiredRole}</strong></p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
                Zpět
              </Button>
              {requiredRole === 'premium' && (
                <Button onClick={() => navigate('/premium')} className="flex-1">
                  <Crown className="h-4 w-4 mr-2" />
                  Aktivovat Premium
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check allowed roles array
  if (allowedRoles.length > 0 && unifiedUser && !allowedRoles.includes(unifiedUser.role)) {
    if (!showFallback) return <Navigate to="/unauthorized" replace />;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Nedostatečná oprávnění</CardTitle>
            <CardDescription>
              Vaše role neumožňuje přístup k této sekci.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Povolené role: {allowedRoles.join(', ')}
            </p>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Zpět
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check feature access
  if (requiredFeature && !canAccess(requiredFeature)) {
    if (!showFallback) return <Navigate to="/premium" replace />;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Crown className="h-6 w-6 text-amber-600" />
            </div>
            <CardTitle>Premium funkce</CardTitle>
            <CardDescription>
              Tato funkce je dostupná pouze pro Premium uživatele.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/premium')}>
              <Crown className="h-4 w-4 mr-2" />
              Aktivovat Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default RouteGuard;
