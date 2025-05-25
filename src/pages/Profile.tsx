
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Activity, Crown, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile, useOrientation } from "@/hooks/use-mobile";

// Import profile components focused on personal info and activity
import ProfileHeader from "@/components/profile/unified/ProfileHeader";
import ProfileOverviewSection from "@/components/profile/unified/ProfileOverviewSection";
import ProfileActivitySection from "@/components/profile/unified/ProfileActivitySection";
import SubscriptionManagement from "@/components/profile/SubscriptionManagement";

const Profile = () => {
  const { user, isPremium } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  
  // Určit, zda je v landscape módu na mobilním zařízení
  const isLandscapeMobile = isMobile && orientation === "landscape";

  if (!user) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Přístup odepřen</h1>
          <p className="text-muted-foreground">Pro zobrazení profilu se musíte přihlásit.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`container max-w-6xl ${
      isLandscapeMobile 
        ? 'py-2 px-2' // Menší padding pro landscape mobile
        : 'py-8'
    }`}>
      <ProfileHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className={isLandscapeMobile ? "mt-4" : "mt-8"}>
        <TabsList className={`grid w-full grid-cols-3 ${
          isLandscapeMobile 
            ? 'h-8 text-xs' // Menší výška a text pro landscape
            : ''
        }`}>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <User className={isLandscapeMobile ? "h-3 w-3" : "h-4 w-4"} />
            {isLandscapeMobile ? "Přehled" : "Přehled"}
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <Crown className={isLandscapeMobile ? "h-3 w-3" : "h-4 w-4"} />
            {isLandscapeMobile ? "Premium" : "Předplatné"}
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className={isLandscapeMobile ? "h-3 w-3" : "h-4 w-4"} />
            Aktivita
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className={isLandscapeMobile ? "mt-3" : "mt-6"}>
          <ProfileOverviewSection />
        </TabsContent>

        <TabsContent value="subscription" className={isLandscapeMobile ? "mt-3" : "mt-6"}>
          <SubscriptionManagement />
        </TabsContent>

        <TabsContent value="activity" className={isLandscapeMobile ? "mt-3" : "mt-6"}>
          <ProfileActivitySection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
