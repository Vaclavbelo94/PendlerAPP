
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { t } = useTranslation('auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('=== LOGIN FORM SUBMIT ===');
    console.log('Email:', email);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.log('Login error:', error);
        toast.error(t('loginFailed'), {
          description: String(error) || t('loginCheckDataRetry'),
        });
      } else {
        console.log('Login successful, letting Login.tsx handle redirect');
        toast.success(t('loginSuccess'));
        // LOGIN FORM NO LONGER HANDLES REDIRECT
        // Login.tsx will handle the redirect based on unifiedUser
      }
    } catch (error: any) {
      console.error('Login exception:', error);
      toast.error(t('loginError'), {
        description: error?.message || t('unknownErrorOccurred'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          autoComplete="email"
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
          autoComplete="current-password"
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
  );
};

export default LoginForm;
