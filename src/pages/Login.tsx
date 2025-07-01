
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnifiedAuth } from "@/contexts/UnifiedAuthContext";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from 'react-i18next';
import LoginForm from "@/components/auth/LoginForm";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import UnifiedRoleIndicator from '@/components/auth/UnifiedRoleIndicator';

const Login = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { user, unifiedUser, isLoading } = useUnifiedAuth();
  const { t } = useTranslation('auth');
  
  useEffect(() => {
    console.log('=== LOGIN PAGE REDIRECT CHECK ===');
    console.log('user:', !!user);
    console.log('isLoading:', isLoading);
    console.log('user email:', user?.email);
    
    // Clear any existing timer
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      setRedirectTimer(null);
    }
    
    // If we have a user and auth is not loading, redirect immediately
    if (user && !isLoading) {
      console.log('User found, redirecting immediately...');
      
      let redirectPath = '/dashboard'; // Default redirect
      
      // Check for admin first (simple email check)
      if (user.email === 'admin@pendlerapp.com') {
        redirectPath = '/admin';
        console.log('Admin user detected, redirecting to:', redirectPath);
      } else if (unifiedUser) {
        // Use unifiedUser data if available
        if (unifiedUser.status === 'pending_setup') {
          redirectPath = unifiedUser.isDHLUser ? '/dhl-setup' : '/setup';
        } else if (unifiedUser.hasAdminAccess) {
          redirectPath = unifiedUser.role === 'dhl_admin' ? '/dhl-admin' : '/admin';
        }
        console.log('UnifiedUser-based redirect to:', redirectPath);
      }
      
      console.log('Final redirect path:', redirectPath);
      navigate(redirectPath, { replace: true });
    } 
    // Emergency timeout - if user exists but we're still loading after 2 seconds, force redirect
    else if (user && isLoading) {
      console.log('User exists but still loading, setting emergency timer...');
      const timer = setTimeout(() => {
        console.log('Emergency redirect triggered');
        navigate('/dashboard', { replace: true });
      }, 2000);
      setRedirectTimer(timer);
    }
    
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [user, isLoading, unifiedUser, navigate]);

  // Show loading while redirecting
  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Přesměrovávám...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-pink-100/30 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 dark:from-blue-600/5 dark:to-purple-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 dark:from-purple-600/5 dark:to-pink-600/5 rounded-full blur-3xl" />
      
      <div className="relative container max-w-md mx-auto py-16 px-4">
        <Card className="w-full bg-card/80 backdrop-blur-sm border shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('login')}
            </CardTitle>
            <CardDescription>
              {t('registerDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-4">
              <GoogleAuthButton 
                isLoading={isGoogleLoading}
                setIsLoading={setIsGoogleLoading}
                isRegister={false}
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t('orContinueWith')} {t('email').toLowerCase()}
                  </span>
                </div>
              </div>
              
              <LoginForm />
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-center w-full text-sm">
              {t('dontHaveAccount')}{" "}
              <Link to="/register" className="text-primary underline-offset-4 hover:underline">
                {t('register')}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
