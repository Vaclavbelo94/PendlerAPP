import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebarV2 } from './AdminSidebarV2';
import { AdminHeaderV2 } from './AdminHeaderV2';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { useAuth } from '@/hooks/auth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

interface AdminLayoutV2Props {
  children: React.ReactNode;
}

export const AdminLayoutV2: React.FC<AdminLayoutV2Props> = ({ children }) => {
  const { unifiedUser, isAdmin } = useAuth();
  const { isLoadingPermissions, hasPermission, permissionError } = useAdminV2();

  console.log('AdminLayoutV2: Auth state:', {
    hasUser: !!unifiedUser,
    email: unifiedUser?.email,
    isAdmin,
    isLoadingPermissions,
    permissionError: permissionError?.message
  });

  if (!unifiedUser) {
    return <Navigate to="/login" replace />;
  }

  // Show error state if permission loading failed but user is not a legacy admin
  if (permissionError && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
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
  
  console.log('AdminLayoutV2: Access control:', {
    hasPermission: hasPermission('viewer'),
    isAdmin,
    hasAccess,
    finalDecision: hasAccess ? 'ACCESS_GRANTED' : 'ACCESS_DENIED'
  });
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nedostatečná oprávnění</h2>
            <p className="text-muted-foreground">
              Nemáte dostatečná oprávnění pro přístup k administračnímu panelu.
            </p>
            <div className="text-sm text-yellow-600 mt-4 p-2 bg-yellow-50 rounded">
              <p>Debug info:</p>
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebarV2 />
        
        <div className="flex-1 flex flex-col">
          <AdminHeaderV2 />
          
          <main className="flex-1 overflow-y-auto">
            <div className="container max-w-7xl mx-auto p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};