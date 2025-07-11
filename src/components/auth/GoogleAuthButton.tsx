
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { checkLocalStorageSpace } from '@/utils/authUtils';

interface GoogleAuthButtonProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isRegister?: boolean;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ 
  isLoading, 
  setIsLoading, 
  isRegister = false 
}) => {
  const { signInWithGoogle } = useAuth();
  const { t } = useTranslation('auth');

  const handleGoogleAuth = async () => {
    if (!checkLocalStorageSpace()) {
      toast.error(t('insufficientStorage'), {
        description: t('insufficientStorageDescription')
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log(`Starting Google ${isRegister ? 'registration' : 'login'}`);
      
      const { error, url } = await signInWithGoogle();
      
      if (error) {
        console.error('Google auth error:', error);
        toast.error(isRegister ? t('googleRegistrationFailed') : 'Přihlášení přes Google se nezdařilo', {
          description: String(error),
        });
        setIsLoading(false);
        return;
      }
      
      if (url) {
        console.log('Redirecting to Google OAuth URL:', url);
        window.location.href = url;
      } else {
        console.error('No URL returned from Google OAuth');
        toast.error('Chyba při přesměrování na Google');
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Google auth exception:', error);
      toast.error(t('registrationError'), {
        description: error?.message || t('unknownErrorOccurred'),
      });
      setIsLoading(false);
    }
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleAuth}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          {t('loading')}
        </div>
      ) : (
        <>
          <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
              <path fill="#EA4335" d="M -14.754 43.989 C -13.074 43.989 -11.514 44.599 -10.324 45.789 L -6.824 42.289 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
            </g>
          </svg>
          {isRegister ? 'Zaregistrovat se přes Google' : 'Přihlásit se přes Google'}
        </>
      )}
    </Button>
  );
};

export default GoogleAuthButton;
