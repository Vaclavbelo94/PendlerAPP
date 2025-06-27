
import React from 'react';
import UnifiedNavbar from '@/components/layouts/UnifiedNavbar';
import Footer from '@/components/layouts/Footer';

interface ModernLayoutProps {
  children: React.ReactNode;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <UnifiedNavbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ModernLayout;
