import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface PromoCodeFieldProps {
  onPromoCodeChange: (code: string, isValid: boolean, isDHL?: boolean) => void;
  validationMode?: 'auto' | 'manual'; // Nový prop pro režim validace
}

const PromoCodeField: React.FC<PromoCodeFieldProps> = ({ 
  onPromoCodeChange, 
  validationMode = 'auto' 
}) => {
  const { t } = useTranslation('auth');
  const [promoCode, setPromoCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);
  const [isDHL, setIsDHL] = useState(false);
  const [hasValidated, setHasValidated] = useState(false); // Pro manual mode

  const validatePromoCode = async (code: string) => {
    console.log('=== PROMO CODE VALIDATION START ===');
    console.log('Validating code:', code);
    
    if (!code.trim()) {
      console.log('Empty code, setting to null');
      setValidationResult(null);
      setIsDHL(false);
      onPromoCodeChange('', false, false);
      return;
    }

    setIsValidating(true);
    
    try {
      // Check if company premium code exists and is valid
      const { data: promoCodeData, error } = await supabase
        .from('company_premium_codes')
        .select('*')
        .eq('is_active', true)
        .filter('code', 'eq', code.trim().toUpperCase())
        .single();

      console.log('Company premium code query result:', { data: promoCodeData, error });

      if (error || !promoCodeData) {
        console.log('Company premium code not found or error:', error);
        setValidationResult('invalid');
        onPromoCodeChange(code, false, false);
        setIsValidating(false);
        return;
      }

      // Check if code is expired
      const validUntil = new Date(promoCodeData.valid_until);
      const validFrom = new Date(promoCodeData.valid_from);
      const now = new Date();
      console.log('Date check:', { validFrom, validUntil, now, isActive: now >= validFrom && now <= validUntil });
      
      if (now < validFrom || now > validUntil) {
        console.log('Company premium code not in valid date range');
        setValidationResult('invalid');
        onPromoCodeChange(code, false, false);
        setIsValidating(false);
        return;
      }

      // Check if code has reached max uses
      const maxUsers = promoCodeData.max_users;
      const usedCount = promoCodeData.used_count || 0;
      console.log('Usage check:', { maxUsers, usedCount, isMaxedOut: maxUsers !== null && usedCount >= maxUsers });
      
      if (maxUsers !== null && usedCount >= maxUsers) {
        console.log('Company premium code usage limit reached');
        setValidationResult('invalid');
        onPromoCodeChange(code, false, false);
        setIsValidating(false);
        return;
      }

      // Check if it's a DHL code
      const isDHLCode = promoCodeData.company === 'dhl';
      console.log('Is DHL company code:', isDHLCode);
      setIsDHL(isDHLCode);

      console.log('Company premium code is valid!');
      setValidationResult('valid');
      onPromoCodeChange(code, true, isDHLCode);
    } catch (error) {
      console.error('Error validating company premium code:', error);
      setValidationResult('invalid');
      onPromoCodeChange(code, false, false);
    } finally {
      setIsValidating(false);
      console.log('=== PROMO CODE VALIDATION END ===');
    }
  };

  const handleChange = (value: string) => {
    setPromoCode(value);
    
    // Reset validation status if code is changed after being validated
    if (validationResult !== null) {
      setValidationResult(null);
      setIsDHL(false);
      setHasValidated(false);
      onPromoCodeChange(value, false, false);
    } else {
      // Just pass the current input value
      onPromoCodeChange(value, false, false);
    }
  };

  const handleValidateClick = () => {
    if (promoCode.trim()) {
      setHasValidated(true);
      validatePromoCode(promoCode);
    }
  };

  // Pro manual režim - zobrazit pouze pokud je kód zadán a není ověřen
  const showValidationButton = validationMode === 'manual' && promoCode.trim() && !hasValidated;
  
  return (
    <div className="grid gap-2">
      <Label htmlFor="promoCode" className="text-dhl-black">
        {t('promoCode')} <span className="text-sm text-gray-500">({t('optional')})</span>
      </Label>
      
      {validationMode === 'manual' ? (
        // Manual validation mode - with button
        <>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="promoCode"
                type="text"
                placeholder={t('promoCodePlaceholder')}
                value={promoCode}
                onChange={(e) => handleChange(e.target.value.toUpperCase())}
                className={cn(
                  "bg-white/80 backdrop-blur-sm border-dhl-black/20 text-dhl-black pr-10",
                  validationResult === 'valid' && "border-green-500 bg-green-50",
                  validationResult === 'invalid' && "border-red-500 bg-red-50",
                  isDHL && "border-dhl-yellow bg-dhl-yellow/10"
                )}
                disabled={isValidating}
              />
              
              {/* Status icons */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isValidating && (
                  <div className="animate-spin h-4 w-4 border-2 border-dhl-red border-t-transparent rounded-full" />
                )}
                {!isValidating && validationResult === 'valid' && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
                {!isValidating && validationResult === 'invalid' && (
                  <X className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
            
            {showValidationButton && (
              <Button
                type="button"
                onClick={handleValidateClick}
                disabled={!promoCode.trim() || isValidating}
                className="bg-dhl-red hover:bg-dhl-red/90 text-white px-4 whitespace-nowrap"
              >
                {isValidating ? '...' : t('promoCodeValidate')}
              </Button>
            )}
          </div>
          
          {/* Status messages for manual mode */}
          <div className="min-h-[1.5rem]">
            {validationResult === 'valid' && (
              <div className={cn(
                "p-3 rounded-lg border flex items-center gap-2",
                isDHL 
                  ? "bg-dhl-yellow/20 border-dhl-yellow text-dhl-black" 
                  : "bg-green-50 border-green-200 text-green-800"
              )}>
                <Check className="h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="font-medium">
                    {isDHL ? t('promoCodeDHLValid') : t('promoCodeValid')}
                  </p>
                  <p className="text-sm opacity-90">
                    {isDHL 
                      ? t('promoCodeDHLDescription')
                      : t('promoCodePremiumDescription')
                    }
                  </p>
                </div>
              </div>
            )}
            {validationResult === 'invalid' && (
              <div className="p-3 rounded-lg border bg-red-50 border-red-200 text-red-800 flex items-center gap-2">
                <X className="h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('promoCodeInvalid')}</p>
                  <p className="text-sm opacity-90">{t('promoCodeInvalidDescription')}</p>
                </div>
              </div>
            )}
            {isValidating && (
              <div className="p-3 rounded-lg border bg-gray-50 border-gray-200 text-gray-700 flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-dhl-red border-t-transparent rounded-full flex-shrink-0" />
                <p>{t('promoCodeValidating')}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        // Auto validation mode - original behavior
        <>
          <div className="relative">
            <Input
              id="promoCode"
              type="text"
              placeholder={t('promoCodePlaceholder')}
              value={promoCode}
              onChange={(e) => handleChange(e.target.value.toUpperCase())}
              className={cn(
                "bg-white/80 backdrop-blur-sm border-dhl-black/20 text-dhl-black pr-10",
                validationResult === 'valid' && "border-green-500 bg-green-50",
                validationResult === 'invalid' && "border-red-500 bg-red-50",
                isDHL && "border-dhl-yellow bg-dhl-yellow/10"
              )}
              disabled={isValidating}
            />
            
            {/* Status icons */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isValidating && (
                <div className="animate-spin h-4 w-4 border-2 border-dhl-red border-t-transparent rounded-full" />
              )}
              {!isValidating && validationResult === 'valid' && (
                <Check className="h-4 w-4 text-green-600" />
              )}
              {!isValidating && validationResult === 'invalid' && (
                <X className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
          
          {/* Status messages for auto mode */}
          <div className="min-h-[1.5rem]">
            {validationResult === 'valid' && (
              <p className={cn(
                "text-sm flex items-center gap-1",
                isDHL ? "text-dhl-red font-medium" : "text-green-600"
              )}>
                <Check className="h-3 w-3" />
                {isDHL ? t('promoCodeDHLValid') : t('promoCodeValid')}
              </p>
            )}
            {validationResult === 'invalid' && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X className="h-3 w-3" />
                {t('promoCodeInvalid')}
              </p>
            )}
            {isValidating && (
              <p className="text-sm text-gray-600">
                {t('promoCodeValidating')}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PromoCodeField;