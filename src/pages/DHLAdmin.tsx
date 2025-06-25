
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import DHLAdminPanel from '@/components/admin/dhl/DHLAdminPanel';

const DHLAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      // DHL admin přístup POUZE pro admin_dhl@pendlerapp.com
      const canAccessDHLAdmin = user.email === 'admin_dhl@pendlerapp.com';
      
      if (!canAccessDHLAdmin) {
        navigate('/dashboard');
      }
    } else if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Zkontrolovat oprávnění - POUZE admin_dhl@pendlerapp.com
  const canAccessDHLAdmin = user?.email === 'admin_dhl@pendlerapp.com';

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
