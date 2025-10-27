import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { revenueCatService } from '@/services/revenueCat';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check, Crown } from 'lucide-react';
import { PurchasesOfferings } from '@revenuecat/purchases-capacitor';

export const PlayBillingPurchase = () => {
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);
  const { toast } = useToast();

  const platform = Capacitor.getPlatform();
  const isNative = platform === 'android' || platform === 'ios';

  useEffect(() => {
    if (!isNative) {
      setIsLoading(false);
      return;
    }

    loadOfferings();
    checkPremiumStatus();
  }, [isNative]);

  const loadOfferings = async () => {
    try {
      await revenueCatService.initialize();
      const availableOfferings = await revenueCatService.getOfferings();
      setOfferings(availableOfferings);
    } catch (error) {
      console.error('Failed to load offerings:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodařilo se načíst dostupné balíčky',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkPremiumStatus = async () => {
    const isPremium = await revenueCatService.checkPremiumEntitlement();
    setHasPremium(isPremium);
  };

  const handlePurchase = async (packageIdentifier: string) => {
    setIsPurchasing(true);
    try {
      await revenueCatService.purchasePackage(packageIdentifier);
      
      toast({
        title: 'Úspěch!',
        description: 'Premium předplatné bylo úspěšně aktivováno',
      });

      await checkPremiumStatus();
      window.location.reload();
    } catch (error: any) {
      if (error.userCancelled) {
        toast({
          title: 'Zrušeno',
          description: 'Nákup byl zrušen',
        });
      } else {
        toast({
          title: 'Chyba',
          description: 'Nepodařilo se dokončit nákup',
          variant: 'destructive'
        });
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      await revenueCatService.restorePurchases();
      await checkPremiumStatus();
      
      toast({
        title: 'Úspěch',
        description: 'Nákupy byly obnoveny',
      });

      window.location.reload();
    } catch (error) {
      toast({
        title: 'Chyba',
        description: 'Nepodařilo se obnovit nákupy',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isNative) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasPremium) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            <CardTitle>Premium aktivní</CardTitle>
          </div>
          <CardDescription>
            Máte aktivní Premium předplatné přes {platform === 'android' ? 'Google Play' : 'App Store'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentOffering = offerings?.current;
  
  if (!currentOffering) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Žádné dostupné balíčky</CardTitle>
          <CardDescription>
            Momentálně nejsou dostupné žádné prémiové balíčky
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={loadOfferings} variant="outline">
            Obnovit
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {currentOffering.availablePackages.map((pkg) => (
        <Card key={pkg.identifier} className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              {pkg.product.title}
            </CardTitle>
            <CardDescription>{pkg.product.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{pkg.product.priceString}</span>
              <span className="text-muted-foreground">
                / {pkg.packageType === 'MONTHLY' ? 'měsíc' : 'rok'}
              </span>
            </div>
            
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Všechny prémiové funkce</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Pokročilý překladač</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Správa směn a přesčasů</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Prioritní podpora</span>
              </li>
            </ul>

            <Button
              onClick={() => handlePurchase(pkg.identifier)}
              disabled={isPurchasing}
              className="w-full"
            >
              {isPurchasing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Zpracovávám...
                </>
              ) : (
                'Koupit Premium'
              )}
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button 
        onClick={handleRestore} 
        variant="outline" 
        className="w-full"
        disabled={isLoading}
      >
        Obnovit nákupy
      </Button>
    </div>
  );
};
