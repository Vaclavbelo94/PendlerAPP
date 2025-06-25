
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';
import UnifiedNavbar from './UnifiedNavbar';
import Footer from './Footer';
import ModernSidebar from './sidebar/ModernSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children?: React.ReactNode;
  navbarRightContent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, navbarRightContent }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { t } = useTranslation('common');

  // Auth pages don't need layout
  const isAuthPage = location.pathname.startsWith('/auth') || 
                     location.pathname === '/login' || 
                     location.pathname === '/register';
  
  // Public pages (no auth required)
  const isPublicPage = ['/', '/about', '/contact', '/pricing'].includes(location.pathname);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <>
        {children || <Outlet />}
        <Toaster position="top-right" />
      </>
    );
  }

  // Public pages layout (for non-authenticated users or public content)
  if (isPublicPage || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <UnifiedNavbar rightContent={navbarRightContent} />
        <main className="flex-1">
          {children || <Outlet />}
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    );
  }

  // Protected layout with sidebar for authenticated users
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex">
          <ModernSidebar />
          <div className="flex-1 flex flex-col min-h-screen ml-64">
            <UnifiedNavbar rightContent={navbarRightContent} />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                {children || <Outlet />}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Mobile Layout - with hamburger menu in navbar */}
      {isMobile && (
        <div className="flex flex-col min-h-screen">
          <UnifiedNavbar rightContent={navbarRightContent} />
          <main className="flex-1 p-4">
            <div className="max-w-7xl mx-auto">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;
