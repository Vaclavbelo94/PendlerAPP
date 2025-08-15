
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Gift, Sparkles, Check } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const QuickPromoCode = () => {
  const { user, unifiedUser } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    console.log('=== PROMO CODE VALIDATION START ===');
    console.log('Input code:', promoCode);
    console.log('Uppercase code:', promoCode.toUpperCase());

    setIsLoading(true);
    try {
      // Real promo code validation against database
      const { data: promoCodeData, error } = await supabase
        .from('company_premium_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('is_active', true)
        .lte('valid_from', new Date().toISOString())
        .gte('valid_until', new Date().toISOString())
        .maybeSingle();

      console.log('Database query result:', { data: promoCodeData, error });
      console.log('Query parameters:', {
        code: promoCode.toUpperCase(),
        current_time: new Date().toISOString()
      });

      if (error) {
        console.error('Promo code validation error:', error);
        toast.error('Nastala chyba při ověřování kódu');
        return;
      }

      if (promoCodeData) {
        console.log('Valid promo code found:', promoCodeData);
        
        // Check if user already has premium or if code has usage limits
        if (unifiedUser?.isPremium) {
          toast.info('Již máte aktivní premium přístup');
          return;
        }

        if (promoCodeData.max_users && promoCodeData.used_count >= promoCodeData.max_users) {
          toast.error('Promo kód již dosáhl maximálního počtu použití');
          return;
        }

        // Code is valid but user needs to be logged in to redeem it
        if (!user) {
          toast.info('Pro aktivaci promo kódu se musíte přihlásit');
          return;
        }

        toast.success('Platný promo kód! Pro aktivaci dokončete registraci.');
        setPromoCode('');
      } else {
        console.log('No matching promo code found');
        toast.error('Neplatný nebo expirovaný promo kód');
      }
    } catch (error) {
      console.error('Promo code error:', error);
      toast.error('Nastala chyba při aktivaci');
    } finally {
      setIsLoading(false);
      console.log('=== PROMO CODE VALIDATION END ===');
    }
  };

  if (unifiedUser?.isPremium) {
    return (
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <Check className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800">Premium aktivní</h3>
            <p className="text-sm text-green-600">Máte přístup ke všem funkcím</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5 text-amber-600" />
          Promo kód
        </CardTitle>
        <CardDescription>
          Aktivujte premium funkce pomocí promo kódu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Zadejte promo kód"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !promoCode.trim()}>
              <Sparkles className="h-4 w-4 mr-1" />
              {isLoading ? 'Aktivuji...' : 'Aktivovat'}
            </Button>
          </div>
        </form>
        
        <div className="mt-4 p-3 bg-amber-100 rounded-lg">
          <p className="text-xs text-amber-800">
            💡 <strong>Tip:</strong> Zkuste kód "DHL_PREMIUM_2025" pro testování
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickPromoCode;
