
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { canAccessDHLFeatures } from '@/utils/dhlAuthUtils';
import SidebarUserSection from './sidebar/SidebarUserSection';
import SidebarThemeSwitcher from './sidebar/SidebarThemeSwitcher';

export const NavbarRightContent: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex items-center gap-4">
      <SidebarThemeSwitcher />
      <SidebarUserSection collapsed={false} />
    </div>
  );
};
