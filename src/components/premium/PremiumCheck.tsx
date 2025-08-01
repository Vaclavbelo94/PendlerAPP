
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { useAuth } from "@/hooks/auth";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PremiumCheckProps {
  featureKey: string;
  children: React.ReactNode;
}

const PremiumCheck: React.FC<PremiumCheckProps> = ({ featureKey, children }) => {
  const navigate = useNavigate();
  const { user, isPremium, isAdmin } = useAuth();
  const { isLoading, canAccess, isPremiumFeature, isSpecialUser, errorMessage } = usePremiumAccess(featureKey);

  // Failsafe: Direct check for special users
  const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com', 'zkouska@gmail.com'];
  const isSpecialUserFailsafe = user?.email && specialEmails.includes(user.email);
  
  console.log('PremiumCheck: Status check', {
    featureKey,
    email: user?.email,
    isSpecialUserFailsafe,
    canAccess,
    isPremium,
    isAdmin,
    isSpecialUser,
    isLoading
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full p-12">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-sm text-muted-foreground mt-4">Ověřuji přístup...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (errorMessage) {
    return (
      <div className="container py-8">
        <Card className="text-center border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Chyba při ověřování</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} variant="outline">
              Zkusit znovu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Failsafe: If user can access OR is special user OR failsafe check passes, show content
  if (canAccess || isSpecialUser || isSpecialUserFailsafe || isPremium || isAdmin) {
    console.log('PremiumCheck: Granting access', {
      reason: canAccess ? 'canAccess' : isSpecialUser ? 'isSpecialUser' : isSpecialUserFailsafe ? 'failsafe' : isPremium ? 'isPremium' : 'isAdmin'
    });
    return <>{children}</>;
  }

  // Show premium prompt for premium features
  if (isPremiumFeature) {
    console.log('PremiumCheck: Showing premium prompt for feature:', featureKey);
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
              <Button variant="outline" onClick={() => navigate("/")}>
                Zpět na hlavní stránku
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback - show content (shouldn't happen with proper logic above)
  console.log('PremiumCheck: Fallback - showing content');
  return <>{children}</>;
};

export default PremiumCheck;
