
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PromoCodeField from './PromoCodeField';
import { checkLocalStorageSpace } from '@/utils/authUtils';
import { activatePromoCode } from '@/services/promoCodeService';
import { isDHL2026PromoCode } from '@/utils/dhl/dhlUtils';

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
    console.log('=== PROMO CODE CHANGE ===');
    console.log('Code:', code, 'Is Valid:', isValid);
    console.log('Updating states - promoCode from', promoCode, 'to', code);
    console.log('Updating states - isPromoValid from', isPromoValid, 'to', isValid);
    
    setPromoCode(code);
    setIsPromoValid(isValid);
    
    console.log('States updated');
  };

  const getEmailPlaceholder = () => {
    switch (i18n.language) {
      case 'de': return 'ihre@email.de';
      case 'pl': return 'twoj@email.pl';
      default: return 'vas@email.cz';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== REGISTRATION START ===');
    console.log('Email:', email);
    console.log('Promo Code:', promoCode);
    console.log('Is Promo Valid:', isPromoValid);
    console.log('Is DHL2026 Code:', isDHL2026PromoCode(promoCode));
    
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
      console.log('Zahajuji registraci pro:', email);
      
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
        
        // Počkáme déle, aby se dokončil trigger pro vytvoření profilu
        console.log('Čekám na vytvoření profilu...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // KONTROLA: zjistíme zda je to DHL2026 promo kód
        const isDHLCode = isDHL2026PromoCode(promoCode);
        console.log('=== KONTROLA PROMO KÓDU PRO AKTIVACI ===');
        console.log('promoCode:', promoCode);
        console.log('isDHLCode:', isDHLCode);
        console.log('isPromoValid:', isPromoValid);
        
        if (promoCode && promoCode.trim().length > 0) {
          console.log('=== AKTIVACE PROMO KÓDU ===');
          console.log('Promo kód:', promoCode);
          console.log('Je validní:', isPromoValid);
          console.log('User ID:', signUpResult.user.id);
          
          const result = await activatePromoCode(signUpResult.user.id, promoCode.trim());
          
          console.log('Výsledek aktivace promo kódu:', result);
          
          if (result.success) {
            if (isDHLCode) {
              // DHL2026 kód - přesměrovat na DHL setup
              toast.success('DHL účet aktivován!', { 
                description: `Premium aktivován s kódem ${promoCode}. Nyní dokončete nastavení DHL profilu.`,
                duration: 8000
              });
              navigate("/dhl-setup");
            } else {
              // Jiný promo kód - normální flow
              toast.success(t('accountCreatedWithPremium'), { 
                description: `Premium aktivován s kódem ${promoCode}. Nyní se můžete přihlásit.`,
                duration: 8000
              });
              navigate("/login");
            }
          } else {
            console.error('Chyba při aktivaci promo kódu:', result.message);
            toast.success(t('accountCreatedSuccessfully'), { 
              description: t('nowYouCanLogin') + ` (Promo kód se nepodařilo aktivovat: ${result.message})`,
              duration: 8000
            });
            navigate("/login");
          }
        } else {
          console.log('Žádný promo kód k aktivaci nebo prázdný kód');
          toast.success(t('accountCreatedSuccessfully'), { 
            description: t('nowYouCanLogin'),
            duration: 5000
          });
          navigate("/login");
        }
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
