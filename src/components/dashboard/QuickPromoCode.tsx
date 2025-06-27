
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Gift, Sparkles, Check } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';

const QuickPromoCode = () => {
  const { user, unifiedUser } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setIsLoading(true);
    try {
      // Mock promo code validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (promoCode.toUpperCase() === 'WELCOME2024') {
        toast.success('Promo kód byl úspěšně aktivován!');
        setPromoCode('');
      } else {
        toast.error('Neplatný promo kód');
      }
    } catch (error) {
      toast.error('Nastala chyba při aktivaci');
    } finally {
      setIsLoading(false);
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
            💡 <strong>Tip:</strong> Zkuste kód "WELCOME2024" pro testování
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickPromoCode;
