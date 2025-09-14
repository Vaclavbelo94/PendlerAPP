
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/auth';
import UnifiedNavbar from './UnifiedNavbar';
import Footer from './Footer';
import ModernSidebar from './sidebar/ModernSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children?: React.ReactNode;
  navbarRightContent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, navbarRightContent }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  // Don't show layout on auth pages
  const isAuthPage = location.pathname.startsWith('/auth') || 
    location.pathname === '/login' || 
    location.pathname === '/register';
  const isPublicPage = ['/', '/about', '/contact', '/features', '/pricing'].includes(location.pathname);
  const isPublicPageWithFooter = ['/', '/about', '/contact', '/features'].includes(location.pathname);

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

  // Public pages layout
  if (isPublicPage && !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <UnifiedNavbar rightContent={navbarRightContent} />
        <main className="flex-1">
          {children || <Outlet />}
        </main>
        {isPublicPageWithFooter && <Footer />}
        <Toaster position="top-right" />
      </div>
    );
  }

  // Protected layout with sidebar
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold mb-2">{t('accessRequired', 'Access Required')}</h2>
          <p className="text-muted-foreground mb-4">{t('loginRequiredMessage', 'Please log in to access this page.')}</p>
          <Button 
            onClick={() => navigate('/login')}
            className="mt-4"
          >
            {t('loginButton', 'Přihlásit se')}
          </Button>
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
          <div className="flex-1 flex flex-col min-h-screen">
            <UnifiedNavbar rightContent={navbarRightContent} />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                {children || <Outlet />}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Mobile Layout */}
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
