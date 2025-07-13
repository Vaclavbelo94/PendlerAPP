
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check, X, Truck, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { isDHLPromoCode } from '@/utils/dhlAuthUtils';

interface PromoCodeFieldProps {
  onPromoCodeChange: (code: string, isValid: boolean, isDHL?: boolean) => void;
}

const PromoCodeField: React.FC<PromoCodeFieldProps> = ({ onPromoCodeChange }) => {
  const [promoCode, setPromoCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);
  const [isDHL, setIsDHL] = useState(false);
  const [hasBeenValidated, setHasBeenValidated] = useState(false);

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
    
    // Check if it's a DHL promo code first
    const isDHLCode = isDHLPromoCode(code);
    console.log('Is DHL promo code:', isDHLCode);
    setIsDHL(isDHLCode);
    
    try {
      // Check if promo code exists and is valid
      const { data: promoCodeData, error } = await supabase
        .from('promo_codes')
        .select('*')
        .ilike('code', code.trim())
        .single();

      console.log('Promo code query result:', { data: promoCodeData, error });

      if (error || !promoCodeData) {
        console.log('Promo code not found or error:', error);
        setValidationResult('invalid');
        onPromoCodeChange(code, false, isDHLCode);
        setIsValidating(false);
        return;
      }

      // Check if code is expired
      const validUntil = new Date(promoCodeData.valid_until);
      const now = new Date();
      console.log('Expiry check:', { validUntil, now, isExpired: validUntil < now });
      
      if (validUntil < now) {
        console.log('Promo code expired');
        setValidationResult('invalid');
        onPromoCodeChange(code, false, isDHLCode);
        setIsValidating(false);
        return;
      }

      // Check if code has reached max uses
      const maxUses = promoCodeData.max_uses;
      const usedCount = promoCodeData.used_count || 0;
      console.log('Usage check:', { maxUses, usedCount, isMaxedOut: maxUses !== null && usedCount >= maxUses });
      
      if (maxUses !== null && usedCount >= maxUses) {
        console.log('Promo code usage limit reached');
        setValidationResult('invalid');
        onPromoCodeChange(code, false, isDHLCode);
        setIsValidating(false);
        return;
      }

      console.log('Promo code is valid!');
      setValidationResult('valid');
      onPromoCodeChange(code, true, isDHLCode);
    } catch (error) {
      console.error('Error validating promo code:', error);
      setValidationResult('invalid');
      onPromoCodeChange(code, false, isDHLCode);
    } finally {
      setIsValidating(false);
      console.log('=== PROMO CODE VALIDATION END ===');
    }
  };

  const handleChange = (value: string) => {
    console.log('Promo code input changed:', value);
    setPromoCode(value);
    
    // Reset validation when user changes the code
    if (hasBeenValidated && value !== promoCode) {
      setValidationResult(null);
      setIsDHL(false);
      setHasBeenValidated(false);
      onPromoCodeChange(value, false, false);
    } else if (!hasBeenValidated) {
      onPromoCodeChange(value, false, false);
    }
  };

  const handleValidateClick = () => {
    console.log('Manual validation triggered for:', promoCode);
    if (promoCode.trim()) {
      setHasBeenValidated(true);
      validatePromoCode(promoCode);
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="promoCode">Promo kód (volitelný)</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="promoCode"
            type="text"
            placeholder="Zadejte promo kód"
            value={promoCode}
            onChange={(e) => handleChange(e.target.value)}
            className={`pr-10 ${
              validationResult === 'valid' ? 'border-green-500' : 
              validationResult === 'invalid' ? 'border-red-500' : ''
            } ${isDHL ? 'border-yellow-500 bg-yellow-50' : ''}`}
          />
          {isValidating && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
          {!isValidating && validationResult === 'valid' && (
            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
          {!isValidating && validationResult === 'invalid' && (
            <X className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
          )}
          {isDHL && !isValidating && (
            <Truck className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-600" />
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleValidateClick}
          disabled={!promoCode.trim() || isValidating}
          className="shrink-0"
        >
          {isValidating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Check className="h-4 w-4 mr-1" />
              Ověřit
            </>
          )}
        </Button>
      </div>
      {validationResult === 'valid' && isDHL && (
        <p className="text-sm text-yellow-600 flex items-center gap-1">
          <Truck className="h-3 w-3" />
          ✓ Speciální promo kód aktivován!
        </p>
      )}
      {validationResult === 'valid' && !isDHL && (
        <p className="text-sm text-green-600">✓ Platný promo kód! Premium bude aktivován po registraci.</p>
      )}
      {validationResult === 'invalid' && (
        <p className="text-sm text-red-600">✗ Neplatný promo kód</p>
      )}
      {isDHL && validationResult === null && promoCode.trim() && (
        <p className="text-sm text-yellow-600 flex items-center gap-1">
          <Truck className="h-3 w-3" />
          Speciální promo kód detekován
        </p>
      )}
    </div>
  );
};

export default PromoCodeField;
