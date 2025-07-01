
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
  const { isLoading, isInitialized, user } = useUnifiedAuth();
  const [forceRender, setForceRender] = useState(false);
  
  // Handle OAuth callback processing
  useOAuthCallback();
  
  // Apply route protection
  useRouteProtection();

  console.log('LayoutWrapper state:', { 
    pathname: location.pathname, 
    isLoading, 
    isInitialized, 
    hasUser: !!user,
    forceRender 
  });

  // MUCH shorter timeout - if auth doesn't initialize in 1 second, force render
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isInitialized && !forceRender) {
        console.warn('LayoutWrapper: Forcing render due to timeout (1s)');
        setForceRender(true);
      }
    }, 1000); // Reduced from 3 seconds to 1 second

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
  
  // Show loading ONLY for very short time and only if not public route
  // Don't show loading for too long - max 1 second
  if (!forceRender && !isInitialized && !isPublicRoute && isLoading) {
    console.log('LayoutWrapper: Showing loading spinner for max 1 second');
    return <SimpleLoadingSpinner />;
  }
  
  // Public routes render without OptimizedLayout
  if (isPublicRoute) {
    console.log('LayoutWrapper: Rendering public route without layout');
    return <>{children}</>;
  }
  
  // Protected routes use OptimizedLayout
  console.log('LayoutWrapper: Rendering with OptimizedLayout');
  return (
    <OptimizedLayout>
      {children}
    </OptimizedLayout>
  );
};

export default LayoutWrapper;
