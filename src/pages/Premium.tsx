
import React from 'react';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Shield, Star } from 'lucide-react';

const Premium = () => {
  const { unifiedUser } = useUnifiedAuth();

  const features = [
    'Neomezené směny a analýzy',
    'Pokročilé daňové kalkulačky',
    'Prémiový překladač s offline režimem',
    'Prioritní zákaznická podpora',
    'Export dat do PDF/Excel',
    'Personalizované statistiky',
    'Pokročilé filtry a vyhledávání',
    'Týmové funkce pro DHL zaměstnance'
  ];

  if (unifiedUser?.hasPremiumAccess) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Premium aktivní!</h1>
          <p className="text-muted-foreground">
            Děkujeme, že jste naším prémiového uživatelem
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Váš Premium stav
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <Badge className="bg-green-500">Aktivní</Badge>
              </div>
              {unifiedUser.premiumExpiry && (
                <div className="flex justify-between items-center">
                  <span>Vyprší:</span>
                  <span>{new Date(unifiedUser.premiumExpiry).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>Typ účtu:</span>
                <span className="font-medium">{unifiedUser.role}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Premium funkce</CardTitle>
            <CardDescription>Funkce, které máte k dispozici</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Upgrade na Premium</h1>
        <p className="text-muted-foreground">
          Odemkněte všechny funkce a využijte plný potenciál PendlerApp
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
            <CardDescription>Základní funkce zdarma</CardDescription>
            <div className="text-3xl font-bold">0 €</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Základní správa směn</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Jednoduchý překladač</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Základní statistiky</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="border-yellow-500 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-yellow-500">Doporučeno</Badge>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Premium
            </CardTitle>
            <CardDescription>Všechny funkce bez omezení</CardDescription>
            <div className="text-3xl font-bold">9.99 €<span className="text-sm font-normal">/měsíc</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" size="lg">
              <Zap className="h-4 w-4 mr-2" />
              Upgrade na Premium
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Special Offers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Speciální nabídky
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">DHL zaměstnanci</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Speciální sleva 50% pro všechny DHL zaměstnance
              </p>
              <Badge variant="outline">Sleva 50%</Badge>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Roční předplatné</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Ušetřete 20% při ročním předplatném
              </p>
              <Badge variant="outline">Sleva 20%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Premium;
