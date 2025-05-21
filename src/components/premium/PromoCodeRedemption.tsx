
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { saveUserToLocalStorage } from "@/utils/authUtils";
import { redeemPromoCode } from "@/components/admin/promoCode/promoCodeService";

const PromoCodeRedemption = () => {
  const [promoCode, setPromoCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshPremiumStatus } = useAuth();

  const handleRedeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !promoCode.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Use the service to redeem the code
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

      // Calculate premium expiry date based on promo code duration
      const premiumExpiry = new Date();
      premiumExpiry.setMonth(premiumExpiry.getMonth() + redemptionCode.duration);
      
      // Use the discount from the promo code
      // If discount is 100%, give full premium access
      const isPremium = redemptionCode.discount === 100;
      
      // Update user's premium status in Supabase
      try {
        // Try to update the database 
        const { error } = await supabase
          .from("profiles")
          .update({
            is_premium: isPremium,
            premium_expiry: isPremium ? premiumExpiry.toISOString() : null
          })
          .eq("id", user.id);
        
        if (error) throw error;
      } catch (dbError) {
        console.error("Error updating premium status in database:", dbError);
        // Continue with local storage update even if database update fails
      }

      // Update in localStorage as backup
      if (user) {
        saveUserToLocalStorage(user, isPremium, isPremium ? premiumExpiry.toISOString() : null);
      }
      
      // Refresh premium status
      await refreshPremiumStatus();
      
      if (isPremium) {
        toast.success(`Premium status byl aktivován do ${premiumExpiry.toLocaleDateString()}`);
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
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <h3 className="text-lg font-medium">Máte promo kód?</h3>
      <p className="text-sm text-muted-foreground">
        Zadejte promo kód pro aktivaci prémiových funkcí
      </p>
      <form onSubmit={handleRedeemCode} className="flex flex-col sm:flex-row gap-2">
        <Input
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="PROMO-PENDLER2025"
          className="flex-1"
        />
        <Button type="submit" disabled={isSubmitting || !promoCode.trim()}>
          {isSubmitting ? "Aktivuji..." : "Aktivovat"}
        </Button>
      </form>
    </div>
  );
};

export default PromoCodeRedemption;
