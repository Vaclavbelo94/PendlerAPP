
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { checkLocalStorageSpace } from "@/utils/authUtils";
import { useTranslation } from 'react-i18next';
import { useOAuthCallback } from "@/hooks/auth/useOAuthCallback";
import RegisterForm from "@/components/auth/RegisterForm";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import StorageWarning from "@/components/auth/StorageWarning";

const Register = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
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
    
    if (user) {
      console.log('User already logged in, redirecting to dashboard');
      navigate("/dashboard");
      return;
    }
    
    if (!checkLocalStorageSpace()) {
      setStorageWarning(true);
    }
  }, [user, navigate]);

  useEffect(() => {
    const hasOAuthTokens = window.location.href.includes('access_token') || 
                          window.location.href.includes('error');
    
    if (!hasOAuthTokens && isGoogleLoading) {
      setIsGoogleLoading(false);
    }
  }, [isGoogleLoading]);

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{t('registerTitle')}</CardTitle>
          <CardDescription>
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
          
          <RegisterForm />
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
  );
};

export default Register;
