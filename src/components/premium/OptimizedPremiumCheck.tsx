
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePremiumManager } from "@/hooks/usePremiumManager";
import { useSimplifiedAuth } from "@/hooks/auth/useSimplifiedAuth";

interface OptimizedPremiumCheckProps {
  featureKey: string;
  children: React.ReactNode;
}

const OptimizedPremiumCheck: React.FC<OptimizedPremiumCheckProps> = ({ featureKey, children }) => {
  const { user, isInitialized } = useSimplifiedAuth();
  const { isPremium, isVerified, isLoading } = usePremiumManager(user);
  const navigate = useNavigate();

  // Show children immediately if user is premium (no flickering)
  if (isPremium && isVerified) {
    return <>{children}</>;
  }

  // Show loading only if we're still initializing and haven't verified yet
  if (!isInitialized || (!isVerified && isLoading)) {
    return (
      <div className="flex justify-center items-center w-full p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Show premium gate for non-premium users
  if (isVerified && !isPremium) {
    return (
      <div className="container py-8 max-w-2xl mx-auto">
        <Card className="text-center border-amber-200 bg-amber-50/50">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-amber-100">
                <LockIcon className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-amber-800">Prémiová funkce</CardTitle>
            <CardDescription className="text-amber-700">
              Tato funkce je dostupná pouze pro uživatele s prémiový účtem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-amber-700">
              Získejte Premium pro přístup ke všem funkcím aplikace Pendler Buddy a usnadněte si práci v Německu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/premium")} 
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <ShieldIcon className="mr-2 h-4 w-4" />
                Aktivovat Premium
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                Zpět na hlavní stránku
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback: show children (fail-safe approach)
  return <>{children}</>;
};

export default OptimizedPremiumCheck;
