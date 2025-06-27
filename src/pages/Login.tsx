
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from 'react-i18next';
import LoginForm from "@/components/auth/LoginForm";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { getAdminRedirectPath } from '@/utils/dhlAuthUtils';

const Login = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation('auth');
  
  useEffect(() => {
    if (user) {
      console.log('=== LOGIN REDIRECT LOGIC ===');
      console.log('User:', user.email);
      console.log('isAdmin:', isAdmin);
      
      // Check for admin redirect first
      const adminPath = getAdminRedirectPath(user);
      if (adminPath) {
        console.log('Redirecting admin to:', adminPath);
        navigate(adminPath);
        return;
      }
      
      // Check if regular admin
      if (isAdmin || user.email === 'admin@pendlerapp.com') {
        console.log('Redirecting regular admin to /admin');
        navigate("/admin");
        return;
      }
      
      // Default redirect to dashboard
      console.log('Redirecting to dashboard');
      navigate("/dashboard");
    }
  }, [user, isAdmin, navigate]);

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
