
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MobileSidebarProps } from './sidebar/types';
import { navigationItems, supportItems } from './sidebar/navigationData';
import { MobileSidebarUserSection } from './sidebar/MobileSidebarUserSection';
import { MobileSidebarNavigationGrid } from './sidebar/MobileSidebarNavigationGrid';
import { MobileSidebarAdminSection } from './sidebar/MobileSidebarAdminSection';
import { MobileSidebarFooter } from './sidebar/MobileSidebarFooter';

const MobileSidebar: React.FC<MobileSidebarProps> = ({ closeSidebar }) => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    if (closeSidebar) closeSidebar();
  };

  const handleLinkClick = () => {
    if (closeSidebar) closeSidebar();
  };

  return (
    <div className="flex flex-col h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">PendlerApp</h2>
      </div>

      {/* User section */}
      <MobileSidebarUserSection 
        handleLinkClick={handleLinkClick}
        handleLogout={handleLogout}
      />

      {/* Main navigation - 2 column grid */}
      <div className="flex-1 overflow-y-auto">
        <MobileSidebarNavigationGrid
          items={navigationItems}
          title="Hlavní funkce"
          handleLinkClick={handleLinkClick}
          gridHeight="h-20"
        />

        {/* Support items - 2 column grid */}
        <MobileSidebarNavigationGrid
          items={supportItems}
          title="Podpora"
          handleLinkClick={handleLinkClick}
          gridHeight="h-16"
        />

        {/* Admin section - only for admin users */}
        <MobileSidebarAdminSection handleLinkClick={handleLinkClick} />
      </div>

      {/* Logout button */}
      <MobileSidebarFooter handleLogout={handleLogout} />
    </div>
  );
};

export default MobileSidebar;
