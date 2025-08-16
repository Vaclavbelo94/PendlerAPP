import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSimplifiedAuth } from "@/hooks/auth/useSimplifiedAuth";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const SimplifiedRegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useSimplifiedAuth();
  const { t } = useTranslation('auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error(t('missingFields'));
      return;
    }
    
    if (!acceptTerms) {
      toast.error(t('acceptTermsRequired'));
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }
    
    if (password.length < 6) {
      toast.error(t('passwordTooShort'));
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate username from email
      const username = email.split('@')[0];
      
      const { error, user } = await signUp(email, password, username, promoCode);
      
      if (error) {
        console.error('Registration error:', error);
        toast.error(typeof error === 'string' ? error : (t('registrationFailed') || 'Registrace se nezdařila'));
        return;
      }

      if (user) {
        toast.success(t('registrationSuccessAutoLogin') || 'Registrace úspěšná! Přihlašujeme vás...');
        // Auto-login is handled by the signUp method
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(t('registrationFailed') || 'Registrace se nezdařila');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('email') || 'Email'}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder') || 'vas.email@example.com'}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t('password') || 'Heslo'}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('passwordPlaceholder') || 'Zadejte vaše heslo'}
            required
            disabled={isLoading}
            minLength={6}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t('confirmPassword') || 'Potvrdit heslo'}</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('confirmPasswordPlaceholder') || 'Potvrďte vaše heslo'}
            required
            disabled={isLoading}
            minLength={6}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="promoCode">{t('promoCode') || 'Promo kód'} ({t('optional') || 'volitelné'})</Label>
        <Input
          id="promoCode"
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          placeholder=""
          disabled={isLoading}
        />
        {promoCode && (
          <p className="text-sm text-muted-foreground">
            {t('promoCodeNote') || 'Promo kód bude ověřen po registraci'}
          </p>
        )}
      </div>

        <div className="flex items-start space-x-2 mb-4">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <Label htmlFor="acceptTerms" className="text-sm text-foreground leading-relaxed">
            {t('acceptTerms')}{' '}
            <a href="/terms" target="_blank" className="text-primary hover:underline">
              {t('termsOfService')}
            </a>{' '}
            {t('and')}{' '}
            <a href="/privacy" target="_blank" className="text-primary hover:underline">
              {t('privacyPolicy')}
            </a>
          </Label>
        </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('registering') || 'Registruje se...'}
          </>
        ) : (
          t('createAccountAndLogin') || 'Vytvořit účet a přihlásit se'
        )}
      </Button>
    </form>
  );
};

export default SimplifiedRegisterForm;