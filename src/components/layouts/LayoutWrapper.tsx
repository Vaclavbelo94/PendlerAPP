
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import OptimizedLayout from './OptimizedLayout';
import { useOAuthCallback } from '@/hooks/auth/useOAuthCallback';
import { useRouteProtection } from '@/hooks/auth/useRouteProtection';
import SimpleLoadingSpinner from '@/components/loading/SimpleLoadingSpinner';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const location = useLocation();
  const { isLoading, isInitialized } = useUnifiedAuth();
  const [forceRender, setForceRender] = useState(false);
  
  // Handle OAuth callback processing
  useOAuthCallback();
  
  // Apply route protection
  useRouteProtection();

  console.log('LayoutWrapper state:', { 
    pathname: location.pathname, 
    isLoading, 
    isInitialized, 
    forceRender 
  });

  // Emergency timeout - if auth doesn't initialize in 10 seconds, force render
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isInitialized && !forceRender) {
        console.warn('LayoutWrapper: Forcing render due to timeout');
        setForceRender(true);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isInitialized, forceRender]);
  
  // Public routes that don't need layout
  const publicRoutes = [
    '/',
    '/about', 
    '/contact', 
    '/features', 
    '/pricing',
    '/login', 
    '/register',
    '/auth'
  ];
  
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  // Show loading while auth is initializing (unless forced or public route)
  if (!forceRender && !isInitialized && !isPublicRoute && isLoading) {
    return <SimpleLoadingSpinner />;
  }
  
  // Public routes render without OptimizedLayout
  if (isPublicRoute) {
    return <>{children}</>;
  }
  
  // Protected routes use OptimizedLayout
  return (
    <OptimizedLayout>
      {children}
    </OptimizedLayout>
  );
};

export default LayoutWrapper;
