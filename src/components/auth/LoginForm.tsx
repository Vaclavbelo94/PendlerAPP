
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
    
    // Validation checks
    if (!email.trim()) {
      toast.error(t('missingFields'), {
        description: t('pleaseEnterEmail'),
      });
      return;
    }
    
    if (!password.trim()) {
      toast.error(t('missingFields'), {
        description: t('pleaseEnterPassword'),
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        let errorMessage = t('invalidCredentials');
        const errorStr = String(error);
        
        if (errorStr.includes("Invalid login credentials") || errorStr.includes("wrong password")) {
          errorMessage = t('wrongPassword');
        } else if (errorStr.includes("Email not confirmed")) {
          errorMessage = "E-mail nebyl potvrzen";
        } else if (errorStr.includes("User not found")) {
          errorMessage = "Uživatel s tímto e-mailem nebyl nalezen";
        }
        
        toast.error(t('loginError'), {
          description: errorMessage,
        });
      } else {
        toast.success(t('loginSuccess'));
        // Automatický reload pro zjištění DHL setup stavu
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error: any) {
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
        <Label htmlFor="email" className="text-dhl-black">{t('email')}</Label>
        <Input
          id="email"
          type="email"
          placeholder="vas@email.cz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/80 backdrop-blur-sm border-dhl-black/20 text-dhl-black"
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-dhl-black">{t('password')}</Label>
          <Link
            to="/forgot-password"
            className="text-sm text-dhl-red underline-offset-4 hover:underline"
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
          className="bg-white/80 backdrop-blur-sm border-dhl-black/20 text-dhl-black"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-dhl-red hover:bg-dhl-red/90 text-white"
        disabled={isLoading}
      >
        {isLoading ? t('loading') : t('login')}
      </Button>
    </form>
  );
};

export default LoginForm;
