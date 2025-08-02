import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ShieldCheck, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { useNavigate } from 'react-router-dom';

export const AdminHeaderV2: React.FC = () => {
  const { unifiedUser } = useAuth();
  const { adminPermissions } = useAdminV2();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // TODO: Add logout functionality
    navigate('/');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Administrace</h1>
            <Badge variant="outline" className="hidden sm:flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              {adminPermissions?.permission_level}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>Přihlášen jako:</span>
            <span className="font-medium">{unifiedUser?.email}</span>
          </div>
          
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="hidden sm:flex"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Obnovit
          </Button>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Odhlásit</span>
          </Button>
        </div>
      </div>
    </header>
  );
};