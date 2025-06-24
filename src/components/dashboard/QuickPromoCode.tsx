
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { activatePromoCode } from "@/services/promoCodeService";

const QuickPromoCode = () => {
  const { user, isPremium, refreshPremiumStatus } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Don't show the widget if user is already premium or not logged in
  if (!user || isPremium) {
    return null;
  }

  const handleRedeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !promoCode.trim()) {
      toast.error("Zadejte platný promo kód");
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Spouštím aktivaci promo kódu:', promoCode.trim());
      
      const result = await activatePromoCode(user.id, promoCode.trim());
      
      if (!result.success) {
        toast.error(result.message || "Neplatný promo kód");
        return;
      }
      
      const redemptionCode = result.promoCode;
      if (!redemptionCode) {
        toast.error("Nastala chyba při získávání informací o promo kódu");
        return;
      }

      console.log('Promo kód aktivován, obnovuji premium status...');
      
      // Refresh premium status after successful redemption
      await refreshPremiumStatus();
      
      // Malé zpoždění a pak refresh stránky pro jistotu
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      if (redemptionCode.discount === 100) {
        const premiumExpiry = new Date();
        premiumExpiry.setMonth(premiumExpiry.getMonth() + redemptionCode.duration);
        toast.success(`Premium status byl aktivován do ${premiumExpiry.toLocaleDateString('cs-CZ')}`, {
          duration: 5000
        });
      } else {
        toast.success(`Promo kód byl použit se slevou ${redemptionCode.discount}%`, {
          duration: 5000
        });
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
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
          <Gift className="h-5 w-5" />
          Máte promo kód?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRedeemCode} className="space-y-3">
          <Input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="DHL2025"
            className="bg-white/50 dark:bg-black/20"
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            disabled={isSubmitting || !promoCode.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isSubmitting ? (
              "Aktivuji..."
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Aktivovat promo kód
              </>
            )}
          </Button>
        </form>
        <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
          Aktivujte prémiové funkce zdarma!
        </p>
      </CardContent>
    </Card>
  );
};

export default QuickPromoCode;
