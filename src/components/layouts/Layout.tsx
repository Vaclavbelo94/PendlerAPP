
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';
import UnifiedNavbar from './UnifiedNavbar';
import Footer from './Footer';
import ModernSidebar from './sidebar/ModernSidebar';
import MobileNavigation from './MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const Layout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { t } = useTranslation('common');

  // Don't show layout on auth pages
  const isAuthPage = location.pathname.startsWith('/auth');
  const isPublicPage = ['/', '/about', '/contact', '/features', '/pricing'].includes(location.pathname);

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
        <Outlet />
        <Toaster position="top-right" />
      </>
    );
  }

  // Public pages layout
  if (isPublicPage && !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <UnifiedNavbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    );
  }

  // Protected layout with sidebar - simplified without AuthGuard
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Required</h2>
          <p className="text-muted-foreground">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex">
          <ModernSidebar />
          <div className="flex-1 flex flex-col min-h-screen ml-64">
            <UnifiedNavbar />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <div className="flex flex-col min-h-screen">
          <UnifiedNavbar />
          <main className="flex-1 p-4 pb-20">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
          <MobileNavigation />
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;
