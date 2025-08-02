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
  const { unifiedUser } = useAuth();
  const { isLoadingPermissions, hasPermission } = useAdminV2();

  if (!unifiedUser) {
    return <Navigate to="/auth" replace />;
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

  if (!hasPermission('viewer')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nedostatečná oprávnění</h2>
            <p className="text-muted-foreground">
              Nemáte dostatečná oprávnění pro přístup k administračnímu panelu.
            </p>
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