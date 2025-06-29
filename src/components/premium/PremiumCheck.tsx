
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUnifiedAuth } from "@/contexts/UnifiedAuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PremiumCheckProps {
  featureKey?: string;
  children: React.ReactNode;
}

const PremiumCheck: React.FC<PremiumCheckProps> = ({ featureKey, children }) => {
  const navigate = useNavigate();
  const { user, unifiedUser, isLoading, canAccess } = useUnifiedAuth();

  console.log('PremiumCheck: Status check', {
    featureKey,
    email: user?.email,
    role: unifiedUser?.role,
    hasPremiumAccess: unifiedUser?.hasPremiumAccess,
    hasAdminAccess: unifiedUser?.hasAdminAccess,
    isLoading
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full p-12">
        <div className="text-center">
          <LoadingSpinner size="md" className="mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Ověřuji přístup...</p>
        </div>
      </div>
    );
  }

  // Check access using unified auth
  const hasAccess = unifiedUser?.hasAdminAccess || 
                   unifiedUser?.hasPremiumAccess || 
                   (featureKey ? canAccess(featureKey) : true);

  if (hasAccess) {
    console.log('PremiumCheck: Granting access');
    return <>{children}</>;
  }

  // Show premium prompt
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
};

export default PremiumCheck;
