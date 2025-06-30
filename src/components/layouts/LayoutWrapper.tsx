
import React from 'react';
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
  
  // Handle OAuth callback processing
  useOAuthCallback();
  
  // Apply route protection
  useRouteProtection();
  
  // Show loading while auth is initializing
  if (!isInitialized || isLoading) {
    return <SimpleLoadingSpinner />;
  }
  
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
