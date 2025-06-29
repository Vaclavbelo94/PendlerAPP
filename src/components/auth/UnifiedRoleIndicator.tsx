
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, Truck, Crown, User } from 'lucide-react';
import { UserRole, UserStatus } from '@/contexts/UnifiedAuthContext';

interface UnifiedRoleIndicatorProps {
  role: UserRole;
  status?: UserStatus;
  className?: string;
  compact?: boolean;
}

const UnifiedRoleIndicator = React.memo<UnifiedRoleIndicatorProps>(({ 
  role, 
  status = 'active', 
  className = '', 
  compact = false 
}) => {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          icon: <Crown className="h-3 w-3" />,
          label: compact ? 'Admin' : 'Administrátor',
          variant: 'destructive' as const,
          className: 'bg-red-500 hover:bg-red-600 text-white'
        };
      case 'dhl_admin':
        return {
          icon: <Truck className="h-3 w-3" />,
          label: 'DHL Admin',
          variant: 'default' as const,
          className: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        };
      case 'dhl_employee':
        return {
          icon: <Truck className="h-3 w-3" />,
          label: compact ? 'DHL' : 'DHL Zaměstnanec',
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
        };
      case 'premium':
        return {
          icon: <ShieldCheck className="h-3 w-3" />,
          label: 'Premium',
          variant: 'default' as const,
          className: 'bg-purple-500 hover:bg-purple-600 text-white'
        };
      default:
        return {
          icon: <User className="h-3 w-3" />,
          label: compact ? 'Standard' : 'Standardní',
          variant: 'outline' as const,
          className: ''
        };
    }
  };

  const roleConfig = getRoleConfig(role);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge 
        variant={roleConfig.variant}
        className={`flex items-center gap-1 ${roleConfig.className}`}
      >
        {roleConfig.icon}
        {roleConfig.label}
      </Badge>
      
      {status === 'pending_setup' && (
        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
          {compact ? 'Setup' : 'Nastavení požadováno'}
        </Badge>
      )}
      
      {status === 'suspended' && (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          Pozastaveno
        </Badge>
      )}
    </div>
  );
});

UnifiedRoleIndicator.displayName = 'UnifiedRoleIndicator';

export default UnifiedRoleIndicator;
