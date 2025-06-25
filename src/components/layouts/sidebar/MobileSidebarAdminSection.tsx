
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { canAccessDHLAdmin } from '@/utils/authStateUtils';

interface MobileSidebarAdminSectionProps {
  handleLinkClick: () => void;
}

export const MobileSidebarAdminSection: React.FC<MobileSidebarAdminSectionProps> = ({
  handleLinkClick
}) => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return null;
  }

  // Check if user can access DHL admin - POUZE admin_dhl@pendlerapp.com
  const isDHLAdminUser = user.email === 'admin_dhl@pendlerapp.com';

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Administrace</h3>
      <div className="space-y-2">
        {/* Standard admin section - pro všechny admin uživatele */}
        <Button
          asChild
          variant={location.pathname === '/admin' ? "secondary" : "ghost"}
          className={cn(
            "w-full h-16 flex flex-col gap-1 text-xs p-2",
            location.pathname === '/admin' && "bg-primary/10 border-primary/20"
          )}
          onClick={handleLinkClick}
        >
          <Link to="/admin">
            <Shield className="h-5 w-5" />
            <span className="text-center leading-tight text-xs font-medium">
              Administrace
            </span>
          </Link>
        </Button>

        {/* DHL Admin section - POUZE pro admin_dhl@pendlerapp.com */}
        {isDHLAdminUser && (
          <Button
            asChild
            variant={location.pathname === '/dhl-admin' ? "secondary" : "ghost"}
            className={cn(
              "w-full h-16 flex flex-col gap-1 text-xs p-2",
              location.pathname === '/dhl-admin' && "bg-primary/10 border-primary/20"
            )}
            onClick={handleLinkClick}
          >
            <Link to="/dhl-admin">
              <Building2 className="h-5 w-5" />
              <span className="text-center leading-tight text-xs font-medium">
                DHL Admin
              </span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
