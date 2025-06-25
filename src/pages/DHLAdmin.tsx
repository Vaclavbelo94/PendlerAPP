
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import DHLAdminPanel from '@/components/admin/dhl/DHLAdminPanel';

const DHLAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      // Povolit přístup pro admin účty a speciální DHL admin
      const canAccessDHLAdmin = isAdmin || 
        user.email === 'admin@pendlerapp.com' || 
        user.email === 'admin_dhl@pendlerapp.com';
      
      if (!canAccessDHLAdmin) {
        navigate('/');
      }
    } else if (!isLoading && !user) {
      navigate('/');
    }
  }, [isAdmin, user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Zkontrolovat oprávnění
  const canAccessDHLAdmin = isAdmin || 
    user?.email === 'admin@pendlerapp.com' || 
    user?.email === 'admin_dhl@pendlerapp.com';

  if (!canAccessDHLAdmin) {
    return null;
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
      <DHLAdminPanel />
    </div>
  );
};

export default DHLAdmin;
