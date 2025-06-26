
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { canAccessDHLFeatures } from '@/utils/dhlAuthUtils';
import { DHLContextSwitcher } from '@/components/dhl/DHLContextSwitcher';
import SidebarUserSection from './sidebar/SidebarUserSection';
import SidebarThemeSwitcher from './sidebar/SidebarThemeSwitcher';

export const NavbarRightContent: React.FC = () => {
  const { user } = useAuth();
  const canAccessDHL = canAccessDHLFeatures(user);
  
  return (
    <div className="flex items-center gap-4">
      {canAccessDHL && <DHLContextSwitcher />}
      <SidebarThemeSwitcher />
      <SidebarUserSection collapsed={false} />
    </div>
  );
};
