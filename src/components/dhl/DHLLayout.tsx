
import React from 'react';
import { DHLNavbar } from './DHLNavbar';
import { DHLSidebar } from './DHLSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface DHLLayoutProps {
  children: React.ReactNode;
  navbarRightContent?: React.ReactNode;
}

export const DHLLayout: React.FC<DHLLayoutProps> = ({ 
  children, 
  navbarRightContent 
}) => {
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
      <div className="flex-1 flex flex-col ml-64">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-yellow-600">DHL Portal</h1>
            </div>
            {navbarRightContent && (
              <div className="flex items-center space-x-4">
                {navbarRightContent}
              </div>
            )}
          </div>
        </div>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
