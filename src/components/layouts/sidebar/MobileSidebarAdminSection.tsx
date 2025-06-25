
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

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

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Administrace</h3>
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
    </div>
  );
};
