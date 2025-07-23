
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/auth";
import { Separator } from "@/components/ui/separator";
import { checkLocalStorageSpace } from "@/utils/authUtils";
import { useTranslation } from 'react-i18next';
import { useOAuthCallback } from "@/hooks/auth/useOAuthCallback";
import LoginForm from "@/components/auth/LoginForm";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import StorageWarning from "@/components/auth/StorageWarning";
import UnifiedNavbar from '@/components/layouts/UnifiedNavbar';

const Login = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const navigate = useNavigate();
  const { user, unifiedUser } = useAuth();
  const { t } = useTranslation('auth');
  
  useOAuthCallback();
  
  useEffect(() => {
    const hasOAuthTokens = window.location.href.includes('access_token') || 
                          window.location.href.includes('error');
    
    if (hasOAuthTokens) {
      console.log('OAuth tokens detected in URL, processing callback...');
      setIsGoogleLoading(true);
      return;
    }
    
    if (user && unifiedUser) {
      console.log('User already logged in, redirecting based on role');
      const redirectPath = unifiedUser.setupRequired ? 
        (unifiedUser.isDHLEmployee ? '/dhl-setup' : '/setup') : 
        '/dashboard';
      navigate(redirectPath);
      return;
    }
    
    if (!checkLocalStorageSpace()) {
      setStorageWarning(true);
    }
  }, [user, unifiedUser, navigate]);

  useEffect(() => {
    const hasOAuthTokens = window.location.href.includes('access_token') || 
                          window.location.href.includes('error');
    
    if (!hasOAuthTokens && isGoogleLoading) {
      setIsGoogleLoading(false);
    }
  }, [isGoogleLoading]);

  return (
    <div className="min-h-screen bg-dhl-yellow relative overflow-hidden">
      {/* Navbar */}
      <UnifiedNavbar />
      
      {/* Background decorations with DHL theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-dhl-red/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-dhl-black/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-dhl-red/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center p-6" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '100px' }}>
        <div className="w-full max-w-md">
          <Card className="w-full bg-white/90 backdrop-blur-sm border shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-dhl-black text-center font-bold">
                {t('loginTitle')}
              </CardTitle>
              <CardDescription className="text-center text-dhl-black/70">
                {t('loginDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {storageWarning && (
                <StorageWarning onDismiss={() => setStorageWarning(false)} />
              )}
              
              <GoogleAuthButton 
                isLoading={isGoogleLoading}
                setIsLoading={setIsGoogleLoading}
                isRegister={false}
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-dhl-black/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-dhl-black/70">
                    {t('loginWithEmail')}
                  </span>
                </div>
              </div>
              
              <LoginForm />
            </CardContent>
            <CardFooter>
              <div className="text-center w-full text-sm">
                <span className="text-dhl-black/70">{t('dontHaveAccount')} </span>
                <Link to="/register" className="text-dhl-red underline-offset-4 hover:underline font-medium">
                  {t('register')}
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
