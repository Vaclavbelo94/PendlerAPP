
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import ProfileBio from "./overview/ProfileBio";
import ProfileInfo from "./overview/ProfileInfo";
import ProfileCards from "./overview/ProfileCards";
import PromoCodeRedemption from "@/components/premium/PromoCodeRedemption";

const ProfileOverview = () => {
  const { user, isPremium } = useAuth();
  const [premiumUntil, setPremiumUntil] = useState<string | null>(null);

  useEffect(() => {
    // Get premium expiry from localStorage
    try {
      const userStr = localStorage.getItem("currentUser");
      if (userStr) {
        const userData = JSON.parse(userStr);
        if (userData.premiumUntil) {
          setPremiumUntil(userData.premiumUntil);
        }
      }
    } catch (e) {
      console.error('Error checking premium status expiry:', e);
    }
  }, [isPremium]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Není nastaveno';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return 'Neznámé datum';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Profil</h2>
      
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ProfileBio />
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                {isPremium ? (
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h3 className="font-medium text-green-600 dark:text-green-400">
                      Premium status aktivní
                    </h3>
                    {premiumUntil && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Platné do: {formatDate(premiumUntil)}
                      </p>
                    )}
                  </div>
                ) : (
                  <PromoCodeRedemption />
                )}
              </div>
            </Card>

            <ProfileInfo />
            <ProfileCards />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileOverview;
