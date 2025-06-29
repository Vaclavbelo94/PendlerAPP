
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUnifiedAuth } from "@/contexts/UnifiedAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  UserIcon, Settings2Icon, ShieldIcon, GraduationCapIcon, BriefcaseIcon
} from "lucide-react";

import ProfileSettings from "@/components/profile/ProfileSettings";
import SocialLinks from "@/components/profile/SocialLinks";
import WorkPreferences from "@/components/profile/WorkPreferences";
import EducationCertificates from "@/components/profile/EducationCertificates";
import ProfileOverview from "@/components/profile/ProfileOverview";

const ProfileExtended = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, unifiedUser } = useUnifiedAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get tab from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get("tab");
  
  const [activeTab, setActiveTab] = useState(tabParam || "overview");
  
  // Update activeTab when URL query parameters change
  useEffect(() => {
    if (tabParam && ["overview", "settings", "education", "work"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  const isOwnProfile = !userId || userId === user?.id;
  const showAdminControls = unifiedUser?.hasAdminAccess && !isOwnProfile;
  
  if (!user && !userId) {
    navigate("/login");
    return null;
  }

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/profile-extended${value !== "overview" ? `?tab=${value}` : ""}`, { replace: true });
  };

  return (
    <div className="container py-6 md:py-10">
      {isOwnProfile ? (
        <h1 className="text-3xl font-bold mb-6">Váš rozšířený profil</h1>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Profil uživatele</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Zpět
          </Button>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 max-w-2xl">
          <TabsTrigger value="overview">
            <UserIcon className="mr-2 h-4 w-4" /> Přehled
          </TabsTrigger>
          {isOwnProfile && (
            <TabsTrigger value="settings">
              <Settings2Icon className="mr-2 h-4 w-4" /> Nastavení
            </TabsTrigger>
          )}
          <TabsTrigger value="education">
            <GraduationCapIcon className="mr-2 h-4 w-4" /> Vzdělání
          </TabsTrigger>
          <TabsTrigger value="work">
            <BriefcaseIcon className="mr-2 h-4 w-4" /> Práce
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profil</CardTitle>
                  <CardDescription>
                    Základní informace o uživateli
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <UserIcon className="h-10 w-10 text-primary" />
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">
                        {unifiedUser?.displayName || user?.email?.split('@')[0] || 'Uživatel'}
                      </h2>
                      <p className="text-muted-foreground">
                        {user?.email}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {isOwnProfile ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate("/profile")}
                          >
                            Upravit základní profil
                          </Button>
                        ) : showAdminControls && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/admin/users/${userId}`)}
                          >
                            <ShieldIcon className="h-4 w-4 mr-2" />
                            Admin kontrola
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />
                  
                  <ProfileOverview 
                    onEdit={handleEdit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isEditing={isEditing}
                  />
                </CardContent>
              </Card>
            </div>

            <div>
              <SocialLinks />
            </div>
          </div>
        </TabsContent>
        
        {isOwnProfile && (
          <TabsContent value="settings">
            <ProfileSettings />
          </TabsContent>
        )}
        
        <TabsContent value="education">
          <EducationCertificates />
        </TabsContent>
        
        <TabsContent value="work">
          <WorkPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileExtended;
