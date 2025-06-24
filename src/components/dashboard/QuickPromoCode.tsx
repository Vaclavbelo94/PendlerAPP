
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const QuickPromoCode = () => {
  const { user, isPremium, refreshPremiumStatus } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Don't show the widget if user is already premium or not logged in
  if (!user || isPremium) {
    return null;
  }

  const redeemPromoCode = async (userId: string, code: string) => {
    try {
      console.log('Aktivuji promo kód:', code, 'pro uživatele:', userId);
      
      // Získáme promo kód z databáze
      const { data: promoCodeData, error: fetchError } = await supabase
        .from('promo_codes')
        .select('*')
        .ilike('code', code.trim())
        .single();

      if (fetchError || !promoCodeData) {
        console.error('Promo kód nenalezen:', fetchError);
        return { success: false, message: "Neplatný promo kód" };
      }

      // Zkontrolujeme platnost
      if (new Date(promoCodeData.valid_until) < new Date()) {
        return { success: false, message: "Tento promo kód již vypršel" };
      }

      if (promoCodeData.max_uses !== null && promoCodeData.used_count >= promoCodeData.max_uses) {
        return { success: false, message: "Tento promo kód byl již vyčerpán" };
      }

      // Zkontrolujeme, zda uživatel už tento kód nepoužil
      const { data: existingRedemption } = await supabase
        .from('promo_code_redemptions')
        .select('id')
        .eq('user_id', userId)
        .eq('promo_code_id', promoCodeData.id);

      if (existingRedemption && existingRedemption.length > 0) {
        return { success: false, message: "Tento promo kód jste již použili" };
      }

      // Vytvoříme redemption záznam
      const { error: redemptionError } = await supabase
        .from('promo_code_redemptions')
        .insert({
          user_id: userId,
          promo_code_id: promoCodeData.id
        });

      if (redemptionError) {
        console.error('Chyba při vytváření redemption záznamu:', redemptionError);
        return { success: false, message: "Chyba při aktivaci promo kódu" };
      }

      // Nastavíme premium status
      const premiumExpiry = new Date();
      premiumExpiry.setMonth(premiumExpiry.getMonth() + promoCodeData.duration);

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          is_premium: true,
          premium_expiry: premiumExpiry.toISOString()
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Chyba při aktivaci premium:', profileError);
        return { success: false, message: "Chyba při aktivaci premium statusu" };
      }

      // Aktualizujeme počet použití
      await supabase
        .from('promo_codes')
        .update({ 
          used_count: promoCodeData.used_count + 1 
        })
        .eq('id', promoCodeData.id);

      return { 
        success: true, 
        promoCode: {
          ...promoCodeData,
          discount: promoCodeData.discount,
          duration: promoCodeData.duration
        }
      };
    } catch (error) {
      console.error("Chyba při uplatňování promo kódu:", error);
      return { success: false, message: "Nastala chyba při aktivaci promo kódu" };
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
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="PROMO-PENDLER2025"
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
                Aktivovat
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
