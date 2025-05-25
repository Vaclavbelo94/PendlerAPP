
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Crown, Calendar, Gift, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { redeemPromoCode } from "@/components/admin/promoCode/promoCodeService";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SubscriptionManagement = () => {
  const { user, isPremium, refreshPremiumStatus } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [premiumUntil, setPremiumUntil] = useState<string | null>(null);

  useEffect(() => {
    // Get premium expiry from localStorage
    try {
      const userStr = localStorage.getItem("currentUser");
      if (userStr) {
        const userData = JSON.parse(userStr);
        if (userData.premiumUntil) {
          setPremiumUntil(userData.premiumUntil);
        }
      }
    } catch (e) {
      console.error('Error checking premium status expiry:', e);
    }
  }, [isPremium]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('cs-CZ');
    } catch (e) {
      return 'Neznámé datum';
    }
  };

  const handleRedeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !promoCode.trim()) return;
    
    setIsSubmitting(true);
    try {
      const result = await redeemPromoCode(user.id, promoCode.trim());
      
      if (!result.success) {
        toast.error(result.message || "Neplatný promo kód");
        return;
      }
      
      const redemptionCode = result.promoCode;
      if (!redemptionCode) {
        toast.error("Nastala chyba při získávání informací o promo kódu");
        return;
      }

      // Refresh premium status after successful redemption
      await refreshPremiumStatus();
      
      if (redemptionCode.discount === 100) {
        const premiumExpiry = new Date();
        premiumExpiry.setMonth(premiumExpiry.getMonth() + redemptionCode.duration);
        toast.success(`Premium status byl aktivován do ${premiumExpiry.toLocaleDateString('cs-CZ')}`);
        setPremiumUntil(premiumExpiry.toISOString());
      } else {
        toast.success(`Promo kód byl použit se slevou ${redemptionCode.discount}%`);
      }
    } catch (error) {
      console.error("Error redeeming promo code:", error);
      toast.error("Nastala chyba při aktivaci promo kódu");
    } finally {
      setIsSubmitting(false);
      setPromoCode("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Stav předplatného
          </CardTitle>
          <CardDescription>
            Přehled vašeho současného předplatného a statusu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Status:</span>
            <Badge variant={isPremium ? "default" : "secondary"} className="flex items-center gap-1">
              {isPremium ? (
                <>
                  <Crown className="h-3 w-3" />
                  Premium
                </>
              ) : (
                "Základní"
              )}
            </Badge>
          </div>
          
          {isPremium && premiumUntil && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Platné do:</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDate(premiumUntil)}
              </div>
            </div>
          )}
          
          {isPremium && (
            <Alert>
              <Crown className="h-4 w-4" />
              <AlertDescription>
                Máte aktivní premium předplatné s přístupem ke všem funkcím aplikace.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Promo Code Redemption */}
      {!isPremium && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Aktivace promo kódu
            </CardTitle>
            <CardDescription>
              Zadejte promo kód pro aktivaci prémiových funkcí
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRedeemCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subscription-promo-code">Promo kód</Label>
                <Input
                  id="subscription-promo-code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="PROMO-PENDLER2025"
                  disabled={isSubmitting}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting || !promoCode.trim()}
                className="w-full"
              >
                {isSubmitting ? "Aktivuji..." : "Aktivovat promo kód"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Premium Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Prémiové funkce</CardTitle>
          <CardDescription>
            Přehled funkcí dostupných s premium předplatným
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Základní plán</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Základní překladač</li>
                <li>• Jednoduchá kalkulačka</li>
                <li>• Kalendář směn</li>
                <li>• Omezený počet slovíček</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-1">
                <Crown className="h-4 w-4 text-yellow-500" />
                Premium plán
              </h4>
              <ul className="text-sm space-y-1">
                <li className={isPremium ? "text-foreground" : "text-muted-foreground"}>
                  • Neomezený překladač
                </li>
                <li className={isPremium ? "text-foreground" : "text-muted-foreground"}>
                  • Pokročilé kalkulačky
                </li>
                <li className={isPremium ? "text-foreground" : "text-muted-foreground"}>
                  • Neomezený počet slovíček
                </li>
                <li className={isPremium ? "text-foreground" : "text-muted-foreground"}>
                  • Offline přístup ke slovíčkům
                </li>
                <li className={isPremium ? "text-foreground" : "text-muted-foreground"}>
                  • Pokročilé grafy a statistiky
                </li>
                <li className={isPremium ? "text-foreground" : "text-muted-foreground"}>
                  • Přednostní podpora
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Notice */}
      {!isPremium && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  Upgradujte na Premium
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Získejte přístup ke všem funkcím aplikace a vylepšete svou zkušenost jako pendler.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionManagement;
