import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { useCompany } from '@/hooks/useCompany';
import { CompanyType } from '@/types/auth';

interface CompanyRedirectProps {
  children?: React.ReactNode;
}

/**
 * Component that handles company-aware redirects after login
 * Redirects users to appropriate company landing pages if no company is selected
 */
export const CompanyRedirect: React.FC<CompanyRedirectProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { company, getCompanyFromStorage } = useCompany();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  // If user is logged in but has no company association
  if (user && !company) {
    const storedCompany = getCompanyFromStorage();
    
    // If there's a stored company preference, redirect to that landing page
    if (storedCompany) {
      return <Navigate to={`/${storedCompany}`} replace />;
    }
    
    // Otherwise redirect to company selector
    return <Navigate to="/" replace />;
  }

  // If user has company but is on wrong landing page, redirect appropriately
  if (user && company) {
    const currentPath = window.location.pathname;
    const isOnCompanyLanding = ['/adecco', '/randstad', '/dhl'].includes(currentPath);
    
    if (isOnCompanyLanding && currentPath !== `/${company}`) {
      return <Navigate to={`/${company}`} replace />;
    }
  }

  return <>{children}</>;
};

export default CompanyRedirect;
