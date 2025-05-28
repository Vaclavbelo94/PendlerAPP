import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUnifiedPremiumStatus } from "@/hooks/useUnifiedPremiumStatus";

interface PremiumCheckProps {
  featureKey: string;
  children: React.ReactNode;
}

const PremiumCheck: React.FC<PremiumCheckProps> = ({ featureKey, children }) => {
  const navigate = useNavigate();
  const { isVerifying, canAccess, isSpecialUser } = useUnifiedPremiumStatus(featureKey);

  // Memoize the premium check result to prevent unnecessary re-renders
  const premiumCheckResult = useMemo(() => {
    // Special users (admin, etc.) get immediate access
    if (isSpecialUser) {
      return { shouldRender: true, showPremiumPrompt: false };
    }

    // If still verifying, show loading
    if (isVerifying) {
      return { shouldRender: false, showPremiumPrompt: false };
    }

    // If can access, show content
    if (canAccess) {
      return { shouldRender: true, showPremiumPrompt: false };
    }

    // Otherwise show premium prompt
    return { shouldRender: false, showPremiumPrompt: true };
  }, [isVerifying, canAccess, isSpecialUser]);

  // Show loading state with timeout fallback
  if (isVerifying && !isSpecialUser) {
    return (
      <div className="flex justify-center items-center w-full p-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Ověřuji přístup...</p>
        </div>
      </div>
    );
  }

  // Show premium prompt
  if (premiumCheckResult.showPremiumPrompt) {
    return (
      <div className="container py-8">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-amber-100">
                <LockIcon className="h-8 w-8 text-amber-500" />
              </div>
            </div>
            <CardTitle className="text-2xl">Prémiová funkce</CardTitle>
            <CardDescription>
              Tato funkce je dostupná pouze pro uživatele s prémiový účtem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              Získejte Premium pro přístup ke všem funkcím aplikace Pendler Pomocník a usnadněte si práci v Německu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate("/premium")} className="bg-amber-500 hover:bg-amber-600">
                <ShieldIcon className="mr-2 h-4 w-4" />
                Aktivovat Premium
              </Button>
              <Button variant="outline" onClick={() => navigate("/language")}>
                Zpět na výuku jazyka
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render children if access is granted
  return <>{children}</>;
};

export default PremiumCheck;
