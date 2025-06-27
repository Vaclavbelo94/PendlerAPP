
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Activity, Crown } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { motion } from "framer-motion";

// Import profile components
import ProfileHeader from "@/components/profile/unified/ProfileHeader";
import ProfileOverviewSection from "@/components/profile/unified/ProfileOverviewSection";
import ProfileSettingsSection from "@/components/profile/unified/ProfileSettingsSection";
import ProfileActivitySection from "@/components/profile/unified/ProfileActivitySection";
import SubscriptionManagement from "@/components/profile/SubscriptionManagement";

const UnifiedProfile = () => {
  const { user, unifiedUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/5">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        <ProfileHeader />
        
        <div className="container py-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
              <TabsList className="grid w-full grid-cols-4 bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
                <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10">
                  <User className="h-4 w-4" />
                  Přehled
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10">
                  <Settings className="h-4 w-4" />
                  Nastavení
                </TabsTrigger>
                <TabsTrigger value="subscription" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10">
                  <Crown className="h-4 w-4" />
                  Předplatné
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10">
                  <Activity className="h-4 w-4" />
                  Aktivita
                </TabsTrigger>
              </TabsList>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
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
              </motion.div>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedProfile;
