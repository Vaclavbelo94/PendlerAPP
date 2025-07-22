import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from 'react-i18next';
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { getRedirectPath } from '@/utils/authRoleUtils';
import RoleIndicator from '@/components/auth/RoleIndicator';
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import UnifiedNavbar from '@/components/layouts/UnifiedNavbar';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user, unifiedUser, isLoading: authLoading, signIn } = useAuth();
  const { t } = useTranslation(['auth', 'common']);
  
  useEffect(() => {
    if (authLoading) return;
    
    if (user && unifiedUser) {
      const redirectPath = getRedirectPath(unifiedUser);
      navigate(redirectPath);
    }
  }, [user, unifiedUser, authLoading, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error(t('auth:allFieldsRequired'));
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast.error(typeof error === 'string' ? error : error.message);
      }
    } catch (err) {
      toast.error(t('auth:loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
      {/* Navbar */}
      <UnifiedNavbar />
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 pt-24">
        <div className="w-full max-w-md">
          {/* Main Login Card */}
          <Card className="bg-background/60 backdrop-blur-lg border-0 shadow-2xl animate-fade-in">
            <CardHeader className="text-center pb-6">
              {/* Login Icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <LogIn className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t('auth:login')}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t('auth:registerDescription')}
              </CardDescription>

              {/* Show current user info if logged in (for debugging) */}
              {unifiedUser && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('common:currentlyLoggedIn')}:
                  </p>
                  <p className="font-medium">{unifiedUser.email}</p>
                  <RoleIndicator 
                    role={unifiedUser.role} 
                    status={unifiedUser.status}
                    className="mt-2"
                  />
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google Sign In */}
              <GoogleAuthButton 
                isLoading={isGoogleLoading}
                setIsLoading={setIsGoogleLoading}
                isRegister={false}
              />
              
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t('auth:orContinueWith')} {t('auth:email').toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t('auth:email')} *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      placeholder={t('auth:email')}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {t('auth:password')} *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      placeholder={t('auth:password')}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline transition-colors"
                  >
                    {t('auth:forgotPassword')}
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('auth:loading')}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      {t('auth:signIn')}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              {/* Register Link */}
              <div className="text-center text-sm text-muted-foreground">
                {t('auth:dontHaveAccount')}{' '}
                <Link 
                  to="/register" 
                  className="text-primary font-medium hover:underline transition-colors"
                >
                  {t('auth:register')}
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