
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnifiedAuth } from "@/contexts/UnifiedAuthContext";
import { Separator } from "@/components/ui/separator";
import { checkLocalStorageSpace } from "@/utils/authUtils";
import { useTranslation } from 'react-i18next';
import { useOAuthCallback } from "@/hooks/auth/useOAuthCallback";
import EnhancedRegisterForm from "@/components/auth/EnhancedRegisterForm";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import StorageWarning from "@/components/auth/StorageWarning";

const Register = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const navigate = useNavigate();
  const { user, unifiedUser } = useUnifiedAuth();
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
      
      // Determine redirect path based on user status and role
      let redirectPath = '/dashboard';
      
      if (unifiedUser.status === 'pending_setup') {
        redirectPath = unifiedUser.isDHLUser ? '/dhl-setup' : '/setup';
      } else if (unifiedUser.hasAdminAccess) {
        redirectPath = unifiedUser.role === 'dhl_admin' ? '/dhl-admin' : '/admin';
      }
      
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-pink-100/30 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10" />
      
      <div className="relative container max-w-md mx-auto py-16 px-4">
        <Card className="w-full bg-card/80 backdrop-blur-sm border shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
              {t('registerTitle')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('registerDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {storageWarning && (
              <StorageWarning onDismiss={() => setStorageWarning(false)} />
            )}
            
            <GoogleAuthButton 
              isLoading={isGoogleLoading}
              setIsLoading={setIsGoogleLoading}
              isRegister={true}
            />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('registerWithEmail')}
                </span>
              </div>
            </div>
            
            <EnhancedRegisterForm />
          </CardContent>
          <CardFooter>
            <div className="text-center w-full text-sm">
              {t('alreadyHaveAccount')}{" "}
              <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                {t('login')}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
