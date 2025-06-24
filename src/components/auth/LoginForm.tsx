
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, isAdmin } = useAuth();
  const { t } = useTranslation('auth');

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
        
        if (email === 'admin@pendlerapp.com' || isAdmin) {
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
  );
};

export default LoginForm;
