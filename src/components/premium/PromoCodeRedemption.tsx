
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { saveUserToLocalStorage } from "@/utils/authUtils";

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  duration: number;
  validUntil: string;
  usedCount: number;
  maxUses: number | null;
}

const PromoCodeRedemption = () => {
  const [promoCode, setPromoCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshPremiumStatus } = useAuth();

  const handleRedeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !promoCode.trim()) return;
    
    setIsSubmitting(true);
    try {
      // First, check if this code exists in localStorage
      const storedCodes = JSON.parse(localStorage.getItem("promoCodes") || "[]");
      const codeToRedeem = storedCodes.find(
        (code: PromoCode) => code.code.toUpperCase() === promoCode.toUpperCase()
      );
      
      if (!codeToRedeem) {
        toast.error("Neplatný promo kód");
        return;
      }

      // Check if code is expired
      if (new Date(codeToRedeem.validUntil) < new Date()) {
        toast.error("Tento promo kód již vypršel");
        return;
      }

      // Check if code has reached max uses
      if (codeToRedeem.maxUses !== null && codeToRedeem.usedCount >= codeToRedeem.maxUses) {
        toast.error("Tento promo kód byl již vyčerpán");
        return;
      }

      // Calculate premium expiry date based on promo code duration
      const premiumExpiry = new Date();
      premiumExpiry.setMonth(premiumExpiry.getMonth() + codeToRedeem.duration);
      
      // Use the discount from the promo code
      // If discount is 100%, give full premium access
      // If less than 100%, we could implement partial premium features or discounted pricing
      const isPremium = codeToRedeem.discount === 100;
      
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
      
      // Update promo code usage count
      codeToRedeem.usedCount += 1;
      localStorage.setItem("promoCodes", JSON.stringify(storedCodes));
      
      // Refresh premium status
      await refreshPremiumStatus();
      
      if (isPremium) {
        toast.success(`Premium status byl aktivován do ${premiumExpiry.toLocaleDateString()}`);
      } else {
        toast.success(`Promo kód byl použit se slevou ${codeToRedeem.discount}%`);
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
