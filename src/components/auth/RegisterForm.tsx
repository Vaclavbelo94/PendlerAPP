
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PromoCodeField from './PromoCodeField';
import { supabase } from '@/integrations/supabase/client';
import { checkLocalStorageSpace } from '@/utils/authUtils';

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { t, i18n } = useTranslation('auth');

  const handlePromoCodeChange = (code: string, isValid: boolean) => {
    setPromoCode(code);
    setIsPromoValid(isValid);
  };

  const getEmailPlaceholder = () => {
    switch (i18n.language) {
      case 'de': return 'ihre@email.de';
      case 'pl': return 'twoj@email.pl';
      default: return 'vas@email.cz';
    }
  };

  const activatePromoCode = async (userId: string, promoCodeValue: string) => {
    try {
      console.log('Aktivuji promo kód:', promoCodeValue, 'pro uživatele:', userId);
      
      const { data: promoCodeData, error: fetchError } = await supabase
        .from('promo_codes')
        .select('*')
        .ilike('code', promoCodeValue.trim())
        .single();

      if (fetchError || !promoCodeData) {
        console.error('Chyba při načítání promo kódu:', fetchError);
        return false;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          is_premium: true,
          premium_expiry: promoCodeData.valid_until 
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Chyba při aktivaci premium:', updateError);
        return false;
      }

      const { error: incrementError } = await supabase
        .from('promo_codes')
        .update({ 
          used_count: promoCodeData.used_count + 1 
        })
        .eq('id', promoCodeData.id);

      if (incrementError) {
        console.error('Chyba při aktualizaci počtu použití:', incrementError);
      }

      console.log('Promo kód úspěšně aktivován');
      return true;
    } catch (error) {
      console.error('Výjimka při aktivaci promo kódu:', error);
      return false;
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
      
      const signUpResult = await signUp(email, password, username);
      
      if (signUpResult.error) {
        let errorMessage = t('registerCheckDataRetry');
        const errorStr = String(signUpResult.error);
        
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
      } else if (signUpResult.user) {
        console.log('Registrace úspěšná, uživatel:', signUpResult.user.id);
        
        if (isPromoValid && promoCode && signUpResult.user.id) {
          console.log('Aktivuji promo kód pro nového uživatele');
          const promoActivated = await activatePromoCode(signUpResult.user.id, promoCode);
          
          if (promoActivated) {
            toast.success(t('accountCreatedWithPremium'), { 
              description: t('promoCodeActivated').replace('{code}', promoCode)
            });
          } else {
            toast.success(t('accountCreatedSuccessfully'), { 
              description: t('nowYouCanLogin') + ' (Promo kód se nepodařilo aktivovat)'
            });
          }
        } else {
          toast.success(t('accountCreatedSuccessfully'), { 
            description: t('nowYouCanLogin')
          });
        }
        
        navigate("/login");
      } else {
        toast.error(t('registrationError'), {
          description: 'Neočekávaná chyba při registraci',
        });
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

  return (
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
  );
};

export default RegisterForm;
