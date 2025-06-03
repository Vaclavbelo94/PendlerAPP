
import React from 'react';
import { useLocation } from 'react-router-dom';
import Layout from './Layout';
import { useOAuthCallback } from '@/hooks/auth/useOAuthCallback';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const location = useLocation();
  
  // Handle OAuth callback processing
  useOAuthCallback();
  
  // Check if we're on a page that should use the layout
  const shouldUseLayout = !location.pathname.startsWith('/auth');
  
  if (!shouldUseLayout) {
    return <>{children}</>;
  }
  
  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default LayoutWrapper;
