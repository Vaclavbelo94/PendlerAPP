
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PromoCodeFieldProps {
  onPromoCodeChange: (code: string, isValid: boolean) => void;
}

const PromoCodeField: React.FC<PromoCodeFieldProps> = ({ onPromoCodeChange }) => {
  const [promoCode, setPromoCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);

  const validatePromoCode = async (code: string) => {
    if (!code.trim()) {
      setValidationResult(null);
      onPromoCodeChange('', false);
      return;
    }

    setIsValidating(true);
    
    try {
      // Check if promo code exists and is valid
      const { data: promoCodeData, error } = await supabase
        .from('promo_codes')
        .select('*')
        .ilike('code', code.trim())
        .single();

      if (error || !promoCodeData) {
        setValidationResult('invalid');
        onPromoCodeChange(code, false);
        setIsValidating(false);
        return;
      }

      // Check if code is expired
      if (new Date(promoCodeData.valid_until) < new Date()) {
        setValidationResult('invalid');
        onPromoCodeChange(code, false);
        setIsValidating(false);
        return;
      }

      // Check if code has reached max uses
      if (promoCodeData.max_uses !== null && promoCodeData.used_count >= promoCodeData.max_uses) {
        setValidationResult('invalid');
        onPromoCodeChange(code, false);
        setIsValidating(false);
        return;
      }

      setValidationResult('valid');
      onPromoCodeChange(code, true);
    } catch (error) {
      console.error('Error validating promo code:', error);
      setValidationResult('invalid');
      onPromoCodeChange(code, false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleChange = (value: string) => {
    setPromoCode(value);
    setValidationResult(null);
    if (!value.trim()) {
      onPromoCodeChange('', false);
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="promoCode">Promo kód (volitelný)</Label>
      <div className="relative">
        <Input
          id="promoCode"
          type="text"
          placeholder="Zadejte promo kód"
          value={promoCode}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => validatePromoCode(promoCode)}
          className={`pr-10 ${
            validationResult === 'valid' ? 'border-green-500' : 
            validationResult === 'invalid' ? 'border-red-500' : ''
          }`}
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
      </div>
      {validationResult === 'valid' && (
        <p className="text-sm text-green-600">✓ Platný promo kód! Premium bude aktivován po registraci.</p>
      )}
      {validationResult === 'invalid' && (
        <p className="text-sm text-red-600">✗ Neplatný promo kód</p>
      )}
    </div>
  );
};

export default PromoCodeField;
