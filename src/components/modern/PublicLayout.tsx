
import React from 'react';
import { UnifiedNavbar } from '@/components/layouts/UnifiedNavbar';
import { ModernFooter } from './ModernFooter';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background w-full">
      <UnifiedNavbar rightContent={<NavbarRightContent />} />
      <main className="flex-1">
        {children}
      </main>
      <ModernFooter />
    </div>
  );
};
