
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import ProfileBio from "./overview/ProfileBio";
import ProfileInfo from "./overview/ProfileInfo";
import ProfileCards from "./overview/ProfileCards";
import PromoCodeRedemption from "@/components/premium/PromoCodeRedemption";
import { formatDate, getShiftTypeLabel } from "./utils/formatters";

interface ProfileOverviewProps {
  userId?: string;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ userId }) => {
  const { user, isPremium } = useAuth();
  const [premiumUntil, setPremiumUntil] = useState<string | null>(null);
  const [workPreferences, setWorkPreferences] = useState<any>(null);
  const [certificatesCount, setCertificatesCount] = useState(0);

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

    // For demo purposes, set some dummy work preferences and certificates count
    setWorkPreferences({
      preferred_shift_type: "morning",
      preferred_locations: ["Munich", "Stuttgart"]
    });
    setCertificatesCount(2);
  }, [isPremium, userId]);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="space-y-6">
        <div className="text-left">
          <h2 className="text-2xl font-bold tracking-tight">Profil</h2>
        </div>
        
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ProfileBio />
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  {isPremium ? (
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-4 rounded-lg">
                      <h3 className="font-medium text-green-600 dark:text-green-400 mb-2">
                        Premium status aktivní
                      </h3>
                      <div className="space-y-2 text-sm">
                        {premiumUntil && (
                          <p className="text-muted-foreground">
                            Platné do: {formatDate(premiumUntil)}
                          </p>
                        )}
                        <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded border">
                          <h4 className="font-medium mb-2">Premium výhody:</h4>
                          <ul className="space-y-1 text-xs">
                            <li>✨ Bez reklam v celé aplikaci</li>
                            <li>📚 Přístup ke všem jazykovým lekcím</li>
                            <li>📊 Pokročilé statistiky a analýzy</li>
                            <li>🔄 Neomezená synchronizace</li>
                            <li>⭐ Prioritní podpora</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <PromoCodeRedemption />
                  )}
                </div>
              </Card>

              <ProfileInfo 
                formatDate={formatDate} 
                createdAt={user?.created_at} 
              />
              
              <ProfileCards 
                workPreferences={workPreferences} 
                certificatesCount={certificatesCount} 
                getShiftTypeLabel={getShiftTypeLabel} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileOverview;
