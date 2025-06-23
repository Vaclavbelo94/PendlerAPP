
import React from 'react';
import { Outlet } from 'react-router-dom';
import UnifiedNavbar from '@/components/layouts/UnifiedNavbar';
import Footer from '@/components/layouts/Footer';

interface PublicLayoutProps {
  children?: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <UnifiedNavbar />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};
