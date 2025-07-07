
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PromoCodeField from './PromoCodeField';
import { refreshPremiumAfterRegistration } from '@/utils/registrationPremiumFix';

const EnhancedRegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isPromoCodeValid, setIsPromoCodeValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();
  const { t } = useTranslation('auth');

  const handlePromoCodeChange = (code: string, isValid: boolean, isDHL?: boolean) => {
    console.log('EnhancedRegisterForm: Promo code change', { code, isValid, isDHL });
    setPromoCode(code);
    setIsPromoCodeValid(isValid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: t('error'),
        description: t('passwordsDoNotMatch'),
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: t('error'),
        description: t('passwordTooShort'),
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log('EnhancedRegisterForm: Starting registration', { 
        email, 
        username, 
        hasPromoCode: !!promoCode,
        promoCode: promoCode || 'none',
        isPromoCodeValid
      });

      const { error, user } = await signUp(email, password, username, promoCode);
      
      if (error) {
        console.error('EnhancedRegisterForm: Registration error:', error);
        toast({
          title: t('registrationFailed'),
          description: typeof error === 'string' ? error : error.message || 'Registration failed',
          variant: 'destructive'
        });
      } else if (user) {
        console.log('EnhancedRegisterForm: Registration successful', { 
          userId: user.id, 
          email: user.email,
          promoCodeUsed: promoCode 
        });
        
        let successMessage = t('registrationSuccessful');
        if (promoCode) {
          successMessage += ` Promo kód ${promoCode} byl aplikován.`;
        }
        
        toast({
          title: t('success'),
          description: successMessage
        });

        // Force refresh premium status after registration with promo code
        if (promoCode && isPromoCodeValid) {
          console.log('EnhancedRegisterForm: Triggering premium refresh after registration');
          setTimeout(async () => {
            try {
              await refreshPremiumAfterRegistration(user.id, user.email || '');
            } catch (error) {
              console.error('EnhancedRegisterForm: Error refreshing premium after registration:', error);
            }
          }, 2000);
        }

        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setUsername('');
        setPromoCode('');
        setIsPromoCodeValid(false);
      }
    } catch (err: any) {
      console.error('EnhancedRegisterForm: Unexpected error:', err);
      toast({
        title: t('error'),
        description: err?.message || t('registrationFailed'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-email">{t('email')}</Label>
        <Input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          placeholder={t('enterEmail')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-username">{t('username')}</Label>
        <Input
          id="register-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          placeholder={t('enterUsername')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">{t('password')}</Label>
        <div className="relative">
          <Input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder={t('enterPassword')}
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
        <Label htmlFor="register-confirm-password">{t('confirmPassword')}</Label>
        <div className="relative">
          <Input
            id="register-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder={t('confirmPassword')}
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

      <PromoCodeField
        onPromoCodeChange={handlePromoCodeChange}
      />

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? t('registering') : t('register')}
      </Button>
    </form>
  );
};

export default EnhancedRegisterForm;
