import React from 'react';
import { useAuth } from '@/hooks/auth';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { MobileAdminNavigation } from './MobileAdminNavigation';
import { MobileAdminHeader } from './MobileAdminHeader';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileAdminLayoutProps {
  children: React.ReactNode;
}

export const MobileAdminLayout: React.FC<MobileAdminLayoutProps> = ({ children }) => {
  const { unifiedUser, isAdmin } = useAuth();
  const { isLoadingPermissions, hasPermission, permissionError } = useAdminV2();
  const isMobile = useIsMobile();

  if (!unifiedUser) {
    return <Navigate to="/login" replace />;
  }

  // Show error state if permission loading failed but user is not a legacy admin
  if (permissionError && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Chyba při načítání oprávnění</h2>
            <p className="text-muted-foreground mb-4">
              Nepodařilo se načíst administrační oprávnění.
            </p>
            <p className="text-sm text-destructive">
              {permissionError.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingPermissions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Ověřování oprávnění...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Allow access if user has admin permissions in the new system OR is admin in the old system
  const hasAccess = hasPermission('viewer') || isAdmin;
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nedostatečná oprávnění</h2>
            <p className="text-muted-foreground mb-4">
              Nemáte dostatečná oprávnění pro přístup k mobilní administraci.
            </p>
            <div className="text-sm text-yellow-600 mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="font-medium mb-1">Debug info:</p>
              <p>Email: {unifiedUser.email}</p>
              <p>Legacy Admin: {isAdmin ? 'ANO' : 'NE'}</p>
              <p>New Permissions: {hasPermission('viewer') ? 'ANO' : 'NE'}</p>
              {permissionError && <p>Error: {permissionError.message}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <MobileAdminHeader />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="p-4 safe-area-bottom">
          {children}
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <MobileAdminNavigation />
    </div>
  );
};