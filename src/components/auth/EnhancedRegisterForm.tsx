
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PromoCodeField from './PromoCodeField';
import { checkLocalStorageSpace } from '@/utils/authUtils';
import { isDHLPromoCode } from '@/utils/dhlAuthUtils';
import { UserRole } from '@/types/auth';

const EnhancedRegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [isDHLCode, setIsDHLCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { t, i18n } = useTranslation('auth');

  const handlePromoCodeChange = (code: string, isValid: boolean, isDHL: boolean = false) => {
    console.log('=== ENHANCED PROMO CODE CHANGE ===');
    console.log('Code:', code, 'Is Valid:', isValid, 'Is DHL:', isDHL);
    
    setPromoCode(code);
    setIsPromoValid(isValid);
    setIsDHLCode(isDHL);
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
    
    console.log('=== ENHANCED REGISTRATION START ===');
    console.log('Email:', email);
    console.log('Promo Code:', promoCode);
    console.log('Is Promo Valid:', isPromoValid);
    console.log('Is DHL Code:', isDHLCode);
    
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
      console.log('Starting enhanced registration for:', email);
      
      const signUpResult = await signUp(email, password, username, promoCode);
      
      if (signUpResult.error) {
        let errorMessage = t('registerCheckDataRetry');
        const errorStr = String(signUpResult.error);
        
        if (errorStr.includes("User already registered") || errorStr.includes("user_already_exists")) {
          errorMessage = t('userAlreadyExists');
        } else if (errorStr.includes("Invalid email")) {
          errorMessage = t('invalidEmailFormat');
        } else if (errorStr.includes("Password")) {
          errorMessage = t('passwordRequirementsNotMet');
        }
        
        toast.error(t('registrationFailed'), {
          description: errorMessage,
        });
      } else if (signUpResult.user) {
        console.log('Enhanced registration successful, user:', signUpResult.user.id);
        
        // Enhanced success handling based on promo code type
        if (isDHLCode) {
          toast.success('DHL účet vytvořen!', { 
            description: `Premium aktivován s kódem ${promoCode}. Nyní dokončete nastavení svého DHL profilu.`,
            duration: 8000
          });
          
          // Navigate to DHL setup after short delay
          setTimeout(() => {
            navigate('/dhl-setup');
          }, 2000);
          return;
        } else if (promoCode && isPromoValid) {
          toast.success(t('accountCreatedWithPremium'), { 
            description: `Premium aktivován s kódem ${promoCode}. Nyní se můžete přihlásit.`,
            duration: 8000
          });
        } else {
          toast.success(t('accountCreatedSuccessfully'), { 
            description: t('nowYouCanLogin'),
            duration: 5000
          });
        }
        
        // Navigate to login after delay
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error: any) {
      console.error('Enhanced registration error:', error);
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
        <Label htmlFor="username">{t('registerUsername')}</Label>
        <Input
          id="username"
          type="text"
          placeholder={t('registerUsernamePlaceholder')}
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
          placeholder={getEmailPlaceholder()}
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
          placeholder={t('registerPasswordMinLength')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-card/50 backdrop-blur-sm border-border"
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
          className="bg-card/50 backdrop-blur-sm border-border"
        />
      </div>
      
      <PromoCodeField onPromoCodeChange={handlePromoCodeChange} />
      
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        disabled={isLoading}
      >
        {isLoading ? t('registerCreating') : t('registerCreateAccount')}
      </Button>
      
      {isDHLCode && (
        <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="font-medium">DHL registrace</p>
          <p>Po dokončení registrace budete přesměrováni na nastavení vašeho DHL profilu.</p>
        </div>
      )}
    </form>
  );
};

export default EnhancedRegisterForm;
