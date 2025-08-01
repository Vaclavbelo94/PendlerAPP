
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import UnifiedNavbar from '@/components/layouts/UnifiedNavbar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const { t } = useTranslation(['auth', 'common']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError('');
    
    // Validate email
    if (!email) {
      setEmailError(t('auth:emailRequired'));
      toast.error(t('auth:emailRequired'));
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(t('auth:invalidEmailFormat'));
      toast.error(t('auth:invalidEmailFormat'));
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Reset password error:', error);
        
        // Handle specific error cases
        if (error.message.includes('User not found') || error.message.includes('Invalid email')) {
          setEmailError(t('auth:emailNotFound'));
          toast.error(t('auth:emailNotFound'));
        } else if (error.message.includes('Email rate limit exceeded') || error.message.includes('rate_limit')) {
          setEmailError(t('auth:emailRateLimit'));
          toast.error(t('auth:emailRateLimit'));
        } else {
          setEmailError(t('auth:resetPasswordError'));
          toast.error(t('auth:resetPasswordError'));
        }
      } else {
        // Supabase always returns success even for non-existent emails for security
        // Show success message but inform user to check their email
        setIsEmailSent(true);
        toast.success(t('auth:resetPasswordEmailSent'));
      }
    } catch (err: any) {
      console.error('Reset password exception:', err);
      setEmailError(t('auth:resetPasswordError'));
      toast.error(t('auth:resetPasswordError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dhl-yellow">
      {/* Navbar */}
      <UnifiedNavbar />
      
      {/* Animated background with DHL theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-dhl-red/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-dhl-black/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-dhl-red/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center p-6" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '100px' }}>
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link to="/login" className="inline-flex items-center text-sm text-dhl-black/70 hover:text-dhl-black mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common:back')}
          </Link>

          {/* Forgot Password Card */}
          <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-2xl animate-fade-in">
            <CardHeader className="text-center pb-4">
              {/* Mail Icon */}
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-dhl-red flex items-center justify-center shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              
              <CardTitle className="text-xl font-bold text-dhl-black">
                {t('auth:forgotPassword')}
              </CardTitle>
              <CardDescription className="text-sm text-dhl-black/70">
                {isEmailSent 
                  ? t('auth:resetPasswordEmailSentDescription')
                  : t('auth:resetPasswordDescription')
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!isEmailSent ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-dhl-black">
                      {t('auth:email')} *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-dhl-black/70" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError('');
                        }}
                        className={`pl-10 transition-all duration-200 focus:ring-2 focus:ring-dhl-red/20 bg-white/80 text-dhl-black ${
                          emailError ? 'border-red-500 focus:ring-red-200' : 'border-dhl-black/20'
                        }`}
                        placeholder={t('auth:email')}
                        required
                      />
                    </div>
                     {emailError && (
                       <p className="text-sm text-red-600 mt-1 flex items-center">
                         <Mail className="w-4 h-4 mr-1" />
                         {emailError}
                       </p>
                     )}
                   </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-dhl-red hover:bg-dhl-red/90 text-white transition-all duration-200 group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('auth:loading')}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {t('auth:sendResetEmail')}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      {t('auth:checkEmailForResetLink')}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => {
                      setIsEmailSent(false);
                      setEmail('');
                    }}
                    variant="outline"
                    className="w-full border-dhl-black/20 text-dhl-black hover:bg-dhl-black/5"
                  >
                    {t('auth:sendAnotherEmail')}
                  </Button>
                </div>
              )}

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-dhl-black/70">
                  {t('auth:rememberPassword')}{' '}
                  <Link 
                    to="/login" 
                    className="text-dhl-red font-medium hover:underline transition-colors"
                  >
                    {t('auth:backToLogin')}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
