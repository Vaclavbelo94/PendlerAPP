
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
  const navigate = useNavigate();
  const { user, unifiedUser, isLoading, isInitialized } = useUnifiedAuth();
  const { t } = useTranslation('auth');
  
  useEffect(() => {
    console.log('=== LOGIN PAGE REDIRECT CHECK ===');
    console.log('isLoading:', isLoading);
    console.log('isInitialized:', isInitialized);
    console.log('user:', !!user);
    console.log('unifiedUser:', !!unifiedUser);
    console.log('user email:', user?.email);
    console.log('unifiedUser details:', unifiedUser ? {
      email: unifiedUser.email,
      role: unifiedUser.role,
      status: unifiedUser.status,
      hasAdminAccess: unifiedUser.hasAdminAccess,
      isDHLUser: unifiedUser.isDHLUser
    } : null);
    
    // Wait for auth to be initialized but don't wait too long
    if (!isInitialized && isLoading) {
      console.log('Auth not initialized yet, waiting...');
      return;
    }
    
    // If we have a user (regardless of unifiedUser state), redirect quickly
    if (user) {
      console.log('User found, determining redirect...');
      
      let redirectPath = '/dashboard'; // Default redirect
      
      // Check for admin first
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
      } else {
        // Fallback redirect even without unifiedUser
        console.log('Fallback redirect to dashboard (no unifiedUser yet)');
      }
      
      console.log('Final redirect path:', redirectPath);
      navigate(redirectPath, { replace: true });
    } else {
      console.log('No user found, staying on login page');
    }
  }, [user, unifiedUser, isLoading, isInitialized, navigate]);

  // Don't show anything while redirecting
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
