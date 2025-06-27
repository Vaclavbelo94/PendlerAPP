
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/auth';
import { canAccessDHLAdmin } from '@/utils/dhlAuthUtils';

interface MobileSidebarAdminSectionProps {
  handleLinkClick: () => void;
}

export const MobileSidebarAdminSection: React.FC<MobileSidebarAdminSectionProps> = ({
  handleLinkClick
}) => {
  const location = useLocation();
  const { user, unifiedUser } = useAuth();
  const isDHLAdmin = canAccessDHLAdmin(user);

  // Don't show if user has no admin privileges
  if (!user || (!unifiedUser?.isAdmin && !isDHLAdmin)) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Administrace</h3>
      <div className="space-y-2">
        {/* Regular Admin */}
        {unifiedUser?.isAdmin && (
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
        )}

        {/* DHL Admin */}
        {isDHLAdmin && (
          <Button
            asChild
            variant={location.pathname === '/dhl-admin' ? "secondary" : "ghost"}
            className={cn(
              "w-full h-16 flex flex-col gap-1 text-xs p-2",
              location.pathname === '/dhl-admin' && "bg-yellow-100 border-yellow-300"
            )}
            onClick={handleLinkClick}
          >
            <Link to="/dhl-admin">
              <Truck className="h-5 w-5" />
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
