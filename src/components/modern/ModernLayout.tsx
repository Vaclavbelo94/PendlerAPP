
import React from 'react';
import { ModernNavbar } from './ModernNavbar';
import { ModernFooter } from './ModernFooter';

interface ModernLayoutProps {
  children: React.ReactNode;
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ModernNavbar />
      <main className="flex-1">
        {children}
      </main>
      <ModernFooter />
    </div>
  );
};
