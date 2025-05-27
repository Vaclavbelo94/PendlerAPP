
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile, useOrientation } from "@/hooks/use-mobile";

// Import profile components focused on personal info and activity
import ProfileHeader from "@/components/profile/unified/ProfileHeader";
import ProfileOverviewSection from "@/components/profile/unified/ProfileOverviewSection";
import ProfileActivitySection from "@/components/profile/unified/ProfileActivitySection";
import SubscriptionManagement from "@/components/profile/SubscriptionManagement";
import ProfileNavigation from "@/components/profile/ProfileNavigation";

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProfileOverviewSection />;
      case "subscription":
        return <SubscriptionManagement />;
      case "activity":
        return <ProfileActivitySection />;
      default:
        return <ProfileOverviewSection />;
    }
  };

  return (
    <div className={`container max-w-6xl ${
      isLandscapeMobile 
        ? 'py-2 px-2' // Menší padding pro landscape mobile
        : 'py-8'
    }`}>
      <ProfileHeader />
      
      <div className={isLandscapeMobile ? "mt-4" : "mt-8"}>
        <ProfileNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className={isLandscapeMobile ? "mt-3" : "mt-6"}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
