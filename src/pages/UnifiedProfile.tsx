
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  UserIcon, Settings2Icon, PaletteIcon, ActivityIcon
} from "lucide-react";

import ProfileOverviewSection from "@/components/profile/unified/ProfileOverviewSection";
import ProfileSettingsSection from "@/components/profile/unified/ProfileSettingsSection";
import ProfileAppearanceSection from "@/components/profile/unified/ProfileAppearanceSection";
import ProfileActivitySection from "@/components/profile/unified/ProfileActivitySection";
import ProfileHeader from "@/components/profile/unified/ProfileHeader";

const UnifiedProfile = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");
  
  if (isLoading) {
    return (
      <div className="container py-6 md:py-10">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <ProfileHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} max-w-2xl`}>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span className={isMobile ? "hidden sm:inline" : ""}>Přehled</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings2Icon className="h-4 w-4" />
            <span className={isMobile ? "hidden sm:inline" : ""}>Nastavení</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <PaletteIcon className="h-4 w-4" />
            <span className={isMobile ? "hidden sm:inline" : ""}>Vzhled</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <ActivityIcon className="h-4 w-4" />
            <span className={isMobile ? "hidden sm:inline" : ""}>Aktivita</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <ProfileOverviewSection />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <ProfileSettingsSection />
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <ProfileAppearanceSection />
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-6">
          <ProfileActivitySection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedProfile;
