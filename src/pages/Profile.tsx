
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile, useOrientation } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

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
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <motion.div 
          className="text-center p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg max-w-md mx-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Přístup odepřen
          </h1>
          <p className="text-muted-foreground">Pro zobrazení profilu se musíte přihlásit.</p>
        </motion.div>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/5">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        <ProfileHeader />
        
        <div className={`container max-w-6xl ${
          isLandscapeMobile 
            ? 'py-2 px-2' // Menší padding pro landscape mobile
            : 'py-8 px-4'
        }`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={isLandscapeMobile ? "mt-4" : "mt-8"}
          >
            <ProfileNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            
            <motion.div 
              className={isLandscapeMobile ? "mt-3" : "mt-6"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {renderTabContent()}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
