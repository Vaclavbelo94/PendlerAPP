import React, { useEffect } from 'react';
import { X, User, Settings, LogOut, Crown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/auth';
import { useHasPermission } from '@/hooks/useAuthPermissions';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { MobileMenuV2 } from './MobileMenuV2';

interface UnifiedMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnifiedMobileMenu: React.FC<UnifiedMobileMenuProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <MobileMenuV2
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};