
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, Truck, Crown, User } from 'lucide-react';
import { UserRole, UserStatus } from '@/types/auth';

interface RoleIndicatorProps {
  role: UserRole;
  status: UserStatus;
  className?: string;
}

const RoleIndicator: React.FC<RoleIndicatorProps> = ({ role, status, className = '' }) => {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return {
          icon: <Crown className="h-3 w-3" />,
          label: 'Administrátor',
          variant: 'destructive' as const,
          className: 'bg-red-500 hover:bg-red-600'
        };
      case UserRole.DHL_ADMIN:
        return {
          icon: <Truck className="h-3 w-3" />,
          label: 'DHL Admin',
          variant: 'default' as const,
          className: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        };
      case UserRole.DHL_EMPLOYEE:
        return {
          icon: <Truck className="h-3 w-3" />,
          label: 'DHL Zaměstnanec',
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
        };
      case UserRole.PREMIUM:
        return {
          icon: <ShieldCheck className="h-3 w-3" />,
          label: 'Premium',
          variant: 'default' as const,
          className: 'bg-purple-500 hover:bg-purple-600 text-white'
        };
      default:
        return {
          icon: <User className="h-3 w-3" />,
          label: 'Standardní',
          variant: 'outline' as const,
          className: ''
        };
    }
  };

  const getStatusConfig = (status: UserStatus) => {
    switch (status) {
      case UserStatus.PENDING_SETUP:
        return {
          label: 'Nastavení požadováno',
          className: 'bg-orange-100 text-orange-800 border-orange-200'
        };
      case UserStatus.SUSPENDED:
        return {
          label: 'Pozastaveno',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return null;
    }
  };

  const roleConfig = getRoleConfig(role);
  const statusConfig = getStatusConfig(status);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge 
        variant={roleConfig.variant}
        className={`flex items-center gap-1 ${roleConfig.className}`}
      >
        {roleConfig.icon}
        {roleConfig.label}
      </Badge>
      
      {statusConfig && (
        <Badge 
          variant="outline"
          className={statusConfig.className}
        >
          {statusConfig.label}
        </Badge>
      )}
    </div>
  );
};

export default RoleIndicator;
