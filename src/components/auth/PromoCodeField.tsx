
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

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
    
    // Simulate API call - replace with actual validation
    setTimeout(() => {
      const isValid = code.toLowerCase() === 'premium30' || code.toLowerCase() === 'welcome';
      setValidationResult(isValid ? 'valid' : 'invalid');
      onPromoCodeChange(code, isValid);
      setIsValidating(false);
    }, 500);
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
