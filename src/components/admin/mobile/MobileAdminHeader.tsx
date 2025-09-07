import React, { useState } from 'react';
import { Bell, Search, Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/auth';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { MobileAdminMenu } from './MobileAdminMenu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const MobileAdminHeader: React.FC = () => {
  const { unifiedUser } = useAuth();
  const { adminPermissions } = useAdminV2();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!unifiedUser?.email) return 'U';
    return unifiedUser.email.charAt(0).toUpperCase();
  };

  const getPermissionBadge = () => {
    if (!adminPermissions?.permission_level) return null;
    
    const colors = {
      super_admin: 'bg-red-100 text-red-800',
      admin: 'bg-orange-100 text-orange-800', 
      dhl_admin: 'bg-yellow-100 text-yellow-800',
      moderator: 'bg-blue-100 text-blue-800',
      viewer: 'bg-green-100 text-green-800'
    };

    const labels = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      dhl_admin: 'DHL Admin', 
      moderator: 'Moderátor',
      viewer: 'Prohlížeč'
    };

    return (
      <Badge variant="secondary" className={colors[adminPermissions.permission_level]}>
        {labels[adminPermissions.permission_level]}
      </Badge>
    );
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 safe-area-top">
      <div className="flex items-center justify-between p-4">
        {/* Left side - Menu and Logo */}
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <MobileAdminMenu />
            </SheetContent>
          </Sheet>
          
          <div>
            <h1 className="text-lg font-semibold">Admin Panel</h1>
            <div className="flex items-center gap-2">
              {getPermissionBadge()}
            </div>
          </div>
        </div>

        {/* Right side - Actions and Profile */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0">
              3
            </Badge>
          </Button>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={unifiedUser?.email} />
                  <AvatarFallback className="text-sm font-medium">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2 border-b">
                <p className="text-sm font-medium">{unifiedUser?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  {getPermissionBadge()}
                </div>
              </div>
              <DropdownMenuItem onClick={() => navigate('/admin/mobile/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Nastavení
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                Odhlásit se
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="px-4 pb-4">
          <Input
            placeholder="Vyhledat uživatele, firmy, nastavení..."
            autoFocus
            onBlur={() => setIsSearchOpen(false)}
          />
        </div>
      )}
    </header>
  );
};