
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { success } = useStandardizedToast();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut();
        success('Úspěšně odhlášen');
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        navigate('/login');
      }
    };

    handleLogout();
  }, [signOut, navigate, success]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Odhlašuji...</p>
      </div>
    </div>
  );
};

export default Logout;
