
import React from 'react';
import { DHLNavbar } from './DHLNavbar';
import { DHLSidebar } from './DHLSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface DHLLayoutProps {
  children: React.ReactNode;
}

export const DHLLayout: React.FC<DHLLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <DHLNavbar />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DHLSidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
};
