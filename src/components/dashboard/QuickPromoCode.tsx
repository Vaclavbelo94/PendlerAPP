
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Sparkles, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { activatePromoCode, fixExistingPromoCodeUsers } from "@/services/promoCodeService";

const QuickPromoCode = () => {
  const { user, isPremium, refreshPremiumStatus } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

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
      
      if (redemptionCode.discount === 100) {
        const premiumExpiry = new Date();
        premiumExpiry.setMonth(premiumExpiry.getMonth() + redemptionCode.duration);
        toast.success(`Premium status byl aktivován do ${premiumExpiry.toLocaleDateString('cs-CZ')}`, {
          duration: 8000
        });
      } else {
        toast.success(`Promo kód byl použit se slevou ${redemptionCode.discount}%`, {
          duration: 8000
        });
      }

      // Krátké zpoždění a pak reload pro aktualizaci UI
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error("Error redeeming promo code:", error);
      toast.error("Nastala chyba při aktivaci promo kódu");
    } finally {
      setIsSubmitting(false);
      setPromoCode("");
    }
  };

  const handleFixExisting = async () => {
    if (!user) return;
    
    setIsFixing(true);
    try {
      console.log('Opravuji existující premium status...');
      
      const result = await fixExistingPromoCodeUsers(user.id);
      
      if (result.success) {
        toast.success("Premium status byl opraven!", { duration: 5000 });
        await refreshPremiumStatus();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(result.message || "Nepodařilo se opravit premium status");
      }
    } catch (error) {
      console.error("Error fixing existing users:", error);
      toast.error("Chyba při opravě premium statusu");
    } finally {
      setIsFixing(false);
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
      <CardContent className="space-y-4">
        <form onSubmit={handleRedeemCode} className="space-y-3">
          <Input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="DHL2026"
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
        
        <div className="pt-2 border-t border-purple-200 dark:border-purple-800">
          <Button 
            onClick={handleFixExisting}
            disabled={isFixing}
            variant="outline"
            size="sm"
            className="w-full text-purple-600 border-purple-300 hover:bg-purple-50"
          >
            {isFixing ? (
              "Opravuji..."
            ) : (
              <>
                <RefreshCw className="h-3 w-3 mr-2" />
                Opravit premium status
              </>
            )}
          </Button>
        </div>
        
        <p className="text-xs text-purple-600 dark:text-purple-400">
          Aktivujte prémiové funkce zdarma! Pokud máte problém s aktivací, zkuste tlačítko "Opravit premium status".
        </p>
      </CardContent>
    </Card>
  );
};

export default QuickPromoCode;
