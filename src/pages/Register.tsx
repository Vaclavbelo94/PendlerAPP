
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import PromoCodeField from "@/components/auth/PromoCodeField";
import { cleanupAuthState, checkLocalStorageSpace } from "@/utils/authUtils";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from 'react-i18next';
import { useOAuthCallback } from "@/hooks/auth/useOAuthCallback";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, user } = useAuth();
  const { t, i18n } = useTranslation('auth');
  
  // Handle OAuth callback
  useOAuthCallback();
  
  useEffect(() => {
    // Check if we have OAuth tokens in URL
    const hasOAuthTokens = window.location.href.includes('access_token') || 
                          window.location.href.includes('error');
    
    if (hasOAuthTokens) {
      console.log('OAuth tokens detected in URL, processing callback...');
      setIsGoogleLoading(true);
      return;
    }
    
    // Redirect user to dashboard if already logged in
    if (user) {
      console.log('User already logged in, redirecting to dashboard');
      navigate("/dashboard");
      return;
    }
    
    // Check localStorage space and clean if needed
    if (!checkLocalStorageSpace()) {
      setStorageWarning(true);
      cleanupAuthState();
    }
  }, [user, navigate]);

  // Reset loading state when not processing OAuth
  useEffect(() => {
    const hasOAuthTokens = window.location.href.includes('access_token') || 
                          window.location.href.includes('error');
    
    if (!hasOAuthTokens && isGoogleLoading) {
      setIsGoogleLoading(false);
    }
  }, [isGoogleLoading]);

  const handlePromoCodeChange = (code: string, isValid: boolean) => {
    setPromoCode(code);
    setIsPromoValid(isValid);
  };

  const handleStorageCleanup = () => {
    cleanupAuthState();
    setStorageWarning(false);
    toast.success(t('storageCleanedUp'));
  };

  const getEmailPlaceholder = () => {
    switch (i18n.language) {
      case 'de': return 'ihre@email.de';
      case 'pl': return 'twoj@email.pl';
      default: return 'vas@email.cz';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }
    
    if (password.length < 6) {
      toast.error(t('passwordTooShort'));
      return;
    }
    
    if (!checkLocalStorageSpace()) {
      toast.error(t('insufficientStorage'), {
        description: t('insufficientStorageDescription')
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Submitting registration form');
      
      const { error } = await signUp(email, password, username);
      
      if (error) {
        let errorMessage = t('registerCheckDataRetry');
        const errorStr = String(error);
        
        if (errorStr.includes("User already registered") || errorStr.includes("user_already_exists")) {
          errorMessage = t('userAlreadyExists');
        } else if (errorStr.includes("Invalid email")) {
          errorMessage = t('invalidEmailFormat');
        } else if (errorStr.includes("Password")) {
          errorMessage = t('passwordRequirementsNotMet');
        } else if (errorStr.includes("quota") || errorStr.includes("storage")) {
          errorMessage = t('browserStorageProblem');
        }
        
        toast.error(t('registrationFailed'), {
          description: errorMessage,
        });
      } else {
        let successMessage = t('accountCreatedSuccessfully');
        let description = t('nowYouCanLogin');
        
        if (isPromoValid && promoCode) {
          successMessage = t('accountCreatedWithPremium');
          description = t('promoCodeActivated').replace('{code}', promoCode);
        }
        
        toast.success(successMessage, { description });
        navigate("/login");
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = t('unknownErrorOccurred');
      
      if (error?.message?.includes("quota") || error?.message?.includes("storage")) {
        errorMessage = t('browserStorageInsufficientSpace');
      }
      
      toast.error(t('registrationError'), {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (!checkLocalStorageSpace()) {
      toast.error(t('insufficientStorage'), {
        description: t('insufficientStorageDescription')
      });
      return;
    }
    
    setIsGoogleLoading(true);
    
    try {
      console.log('Starting Google registration');
      
      const { error, url } = await signInWithGoogle();
      
      if (error) {
        console.error('Google registration error:', error);
        toast.error(t('googleRegistrationFailed'), {
          description: String(error),
        });
        setIsGoogleLoading(false);
        return;
      }
      
      if (url) {
        console.log('Redirecting to Google OAuth URL:', url);
        // Don't redirect immediately, let the OAuth flow handle it
        window.location.href = url;
      } else {
        console.error('No URL returned from Google OAuth');
        toast.error('Chyba při přesměrování na Google');
        setIsGoogleLoading(false);
      }
    } catch (error: any) {
      console.error('Google registration exception:', error);
      toast.error(t('registrationError'), {
        description: error?.message || t('unknownErrorOccurred'),
      });
      setIsGoogleLoading(false);
    }
  };

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
            <Alert className="border-yellow-500/20 bg-yellow-50 dark:bg-yellow-900/10">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                <div className="flex flex-col space-y-2">
                  <span>{t('browserStorageFull')}</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleStorageCleanup}
                    className="w-fit"
                  >
                    {t('cleanStorage')}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleRegister}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
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
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                  </g>
                </svg>
                {t('registerWithGoogle')}
              </>
            )}
          </Button>
          
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
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">{t('registerUsername')}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t('registerUsernamePlaceholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={getEmailPlaceholder()}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('registerPasswordMinLength')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">{t('registerConfirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('registerConfirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <PromoCodeField onPromoCodeChange={handlePromoCodeChange} />
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('registerCreating') : t('registerCreateAccount')}
            </Button>
          </form>
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
