
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Activity, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Import profile components
import ProfileHeader from "@/components/profile/unified/ProfileHeader";
import ProfileOverviewSection from "@/components/profile/unified/ProfileOverviewSection";
import ProfileSettingsSection from "@/components/profile/unified/ProfileSettingsSection";
import ProfileActivitySection from "@/components/profile/unified/ProfileActivitySection";
import SubscriptionManagement from "@/components/profile/SubscriptionManagement";

const UnifiedProfile = () => {
  const { user, isPremium } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

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
    <div className="container py-8 max-w-6xl">
      <ProfileHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Přehled
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Nastavení
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Předplatné
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Aktivita
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ProfileOverviewSection />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <ProfileSettingsSection />
        </TabsContent>

        <TabsContent value="subscription" className="mt-6">
          <SubscriptionManagement />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ProfileActivitySection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedProfile;
