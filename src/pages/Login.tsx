
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, user, isAdmin } = useAuth();
  const { t } = useTranslation('auth');
  
  useEffect(() => {
    // Redirect user based on their role if already logged in
    if (user) {
      if (isAdmin || user.email === 'admin@pendlerapp.com') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(t('registrationFailed'), {
          description: error || t('registerCheckDataRetry'),
        });
      } else {
        toast.success(t('accountCreatedSuccessfully'));
        
        // Přesměrování admina na admin panel
        if (email === 'admin@pendlerapp.com') {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast.error(t('registrationError'), {
        description: error?.message || t('unknownErrorOccurred'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    
    try {
      const { error, url } = await signInWithGoogle();
      
      if (error) {
        toast.error(t('googleRegistrationFailed'), {
          description: error || t('unknownErrorOccurred'),
        });
        setIsGoogleLoading(false);
        return;
      }
      
      // Pokud máme URL pro přesměrování, přesměrujeme uživatele (standardní OAuth flow)
      if (url) {
        window.location.href = url;
        // Necháváme loading stav aktivní, protože se přesměrovává
        return;
      }
    } catch (error: any) {
      toast.error(t('registrationError'), {
        description: error?.message || t('unknownErrorOccurred'),
      });
      setIsGoogleLoading(false);
    }
  };

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
              {/* Google Login Button */}
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 bg-card/50 backdrop-blur-sm border-border hover:bg-muted/70"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  t('loading')
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
                    {t('signInWithGoogle')}
                  </>
                )}
              </Button>
              
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
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vas@email.cz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-card/50 backdrop-blur-sm border-border"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t('password')}</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary underline-offset-4 hover:underline"
                    >
                      {t('forgotPassword')}
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-card/50 backdrop-blur-sm border-border"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? t('loading') : t('login')}
                </Button>
              </form>
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
