
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

  // Public pages (no auth required)
  const isPublicPage = ['/', '/about', '/contact', '/pricing'].includes(location.pathname);
  
  // Protected pages that require authentication
  const isProtectedPage = [
    '/dashboard', '/profile', '/settings', '/shifts', '/travel', 
    '/vehicle', '/translator', '/tax-advisor', '/laws', '/admin', 
    '/dhl-admin', '/dhl-dashboard'
  ].some(path => location.pathname.startsWith(path));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For public pages or when user is not authenticated
  if (isPublicPage || (!user && !isProtectedPage)) {
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

  // For protected pages, redirect to login if not authenticated
  if (isProtectedPage && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">{t('authRequired') || 'Přihlášení vyžadováno'}</h2>
          <p className="text-muted-foreground mb-4">{t('pleaseLogin') || 'Pro přístup k této stránce se musíte přihlásit'}</p>
          <a href="/login" className="text-primary hover:underline">{t('goToLogin') || 'Přejít na přihlášení'}</a>
        </div>
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
