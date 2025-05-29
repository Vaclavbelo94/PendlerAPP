
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { redeemPromoCode } from "@/components/admin/promoCode/promoCodeService";

const PromoCodeRedemption = () => {
  const { user, refreshPremiumStatus } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRedeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !promoCode.trim()) {
      toast.error("Zadejte platný promo kód");
      return;
    }
    
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
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-amber-600" />
          Máte promo kód?
        </CardTitle>
        <CardDescription>
          Aktivujte si premium funkce zdarma pomocí promo kódu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRedeemCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promo-code">Promo kód</Label>
            <Input
              id="promo-code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="PREMIUM2024"
              disabled={isSubmitting}
              className="bg-white dark:bg-gray-800"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting || !promoCode.trim()}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isSubmitting ? "Aktivuji..." : "Aktivovat promo kód"}
          </Button>
        </form>
        
        <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Tip:</strong> Promo kódy získáte za účast v komunitních aktivitách, 
            referrals nebo speciálních akcích.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromoCodeRedemption;
