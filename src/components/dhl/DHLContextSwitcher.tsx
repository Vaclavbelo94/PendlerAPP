
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Home, ArrowLeftRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { canAccessDHLFeatures } from '@/utils/dhlAuthUtils';
import { cn } from '@/lib/utils';

export const DHLContextSwitcher: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const canAccessDHL = canAccessDHLFeatures(user);
  const isDHLRoute = location.pathname.startsWith('/dhl-');
  
  // Don't show if user can't access DHL features
  if (!canAccessDHL) return null;
  
  const handleToggle = () => {
    if (isDHLRoute) {
      // Switch to standard mode - go to main dashboard
      navigate('/dashboard');
    } else {
      // Switch to DHL mode - go to DHL dashboard
      navigate('/dhl-dashboard');
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-2 transition-all duration-200",
          isDHLRoute 
            ? "border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-800" 
            : "hover:border-yellow-200 hover:bg-yellow-50"
        )}
      >
        {isDHLRoute ? (
          <>
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Standardní režim</span>
          </>
        ) : (
          <>
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">DHL režim</span>
          </>
        )}
        <ArrowLeftRight className="h-3 w-3" />
      </Button>
      
      {isDHLRoute && (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          DHL
        </Badge>
      )}
    </div>
  );
};
