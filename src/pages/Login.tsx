
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
  const { user, isLoading } = useUnifiedAuth();
  const { t } = useTranslation('auth');
  
  useEffect(() => {
    console.log('=== LOGIN PAGE IMMEDIATE REDIRECT CHECK ===');
    console.log('user exists:', !!user);
    console.log('user email:', user?.email);
    console.log('isLoading:', isLoading);
    
    // IMMEDIATE redirect if user exists - don't wait for anything else
    if (user) {
      console.log('User found, redirecting IMMEDIATELY without waiting...');
      
      let redirectPath = '/dashboard'; // Default redirect
      
      // Simple admin check - only check email
      if (user.email === 'admin@pendlerapp.com') {
        redirectPath = '/admin';
        console.log('Admin user detected, redirecting to:', redirectPath);
      }
      
      console.log('Immediate redirect to:', redirectPath);
      
      // Use window.location for guaranteed redirect (fallback if navigate fails)
      setTimeout(() => {
        console.log('Executing window.location redirect as fallback');
        window.location.href = redirectPath;
      }, 100);
      
      // Also try React Router navigate
      navigate(redirectPath, { replace: true });
    }
    
    // Emergency timeout - if auth is still loading after 1 second, something is wrong
    if (isLoading) {
      console.log('Auth still loading, setting 1-second emergency timer...');
      const timer = setTimeout(() => {
        if (user) {
          console.log('Emergency redirect - user exists but still loading');
          window.location.href = '/dashboard';
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate, isLoading]);

  // Show loading while redirecting (only if user exists)
  if (user) {
    console.log('Showing redirect loading screen for user:', user.email);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Přesměrovávám...</p>
          <p className="text-xs text-muted-foreground mt-2">
            Pokud se nestane nic do 2 sekund, <a href="/dashboard" className="underline">klikněte zde</a>
          </p>
        </div>
      </div>
    );
  }

  console.log('Rendering login form - no user found');

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
