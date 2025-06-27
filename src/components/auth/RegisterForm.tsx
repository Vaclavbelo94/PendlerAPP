
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { t } = useTranslation('auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signUp(email, password, username);
      
      if (error) {
        toast.error(t('registrationFailed'), {
          description: String(error) || t('registerCheckDataRetry'),
        });
      } else {
        toast.success(t('accountCreatedSuccessfully'));
        navigate("/dashboard");
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
        <Label htmlFor="username">{t('username')}</Label>
        <Input
          id="username"
          type="text"
          placeholder={t('enterUsername')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-card/50 backdrop-blur-sm border-border"
        />
      </div>
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
        <Label htmlFor="password">{t('password')}</Label>
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
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="bg-card/50 backdrop-blur-sm border-border"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        disabled={isLoading}
      >
        {isLoading ? t('loading') : t('register')}
      </Button>
      <div className="text-center text-sm">
        <span className="text-muted-foreground">{t('alreadyHaveAccount')} </span>
        <Link to="/login" className="text-primary underline-offset-4 hover:underline">
          {t('login')}
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
