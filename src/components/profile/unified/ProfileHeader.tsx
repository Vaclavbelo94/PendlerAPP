
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { ShieldIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile, useOrientation } from "@/hooks/use-mobile";

const ProfileHeader = () => {
  const { user, isPremium, isAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  
  // Určit, zda je v landscape módu na mobilním zařízení
  const isLandscapeMobile = isMobile && orientation === "landscape";

  return (
    <div className={isLandscapeMobile ? "mb-4" : "mb-8"}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isLandscapeMobile ? "mb-3" : "mb-6"}`}>
        <div>
          <h1 className={`font-bold tracking-tight ${isLandscapeMobile ? "text-2xl" : "text-3xl"}`}>Můj profil</h1>
          <p className={`text-muted-foreground ${isLandscapeMobile ? "text-sm" : ""}`}>
            Spravujte své osobní údaje a nastavení
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Badge variant="destructive" className={`flex items-center gap-1 ${isLandscapeMobile ? "text-xs px-2 py-0" : ""}`}>
              <ShieldIcon className={isLandscapeMobile ? "h-2 w-2" : "h-3 w-3"} />
              {isLandscapeMobile ? "Admin" : "Administrátor"}
            </Badge>
          )}
          {isPremium && (
            <Badge variant="default" className={`bg-amber-500 hover:bg-amber-600 flex items-center gap-1 ${isLandscapeMobile ? "text-xs px-2 py-0" : ""}`}>
              <ShieldIcon className={isLandscapeMobile ? "h-2 w-2" : "h-3 w-3"} />
              Premium
            </Badge>
          )}
        </div>
      </div>

      <div className={`flex items-center gap-4 bg-card rounded-lg border ${isLandscapeMobile ? "p-3" : "p-6"}`}>
        <div className={`rounded-full bg-primary/10 flex items-center justify-center ${
          isLandscapeMobile ? "h-12 w-12" : "h-16 w-16"
        }`}>
          <UserIcon className={`${isLandscapeMobile ? "h-6 w-6" : "h-8 w-8"} text-primary`} />
        </div>
        
        <div className="flex-1">
          <h2 className={`font-semibold ${isLandscapeMobile ? "text-lg" : "text-xl"}`}>
            {user?.user_metadata?.username || user?.email?.split('@')[0] || 'Uživatel'}
          </h2>
          <p className={`text-muted-foreground ${isLandscapeMobile ? "text-sm" : ""}`}>{user?.email}</p>
          <div className={`flex items-center gap-2 ${isLandscapeMobile ? "mt-1" : "mt-2"}`}>
            <span className={`text-muted-foreground ${isLandscapeMobile ? "text-xs" : "text-sm"}`}>
              Registrován: {user?.created_at ? new Date(user.created_at).toLocaleDateString('cs-CZ') : 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {!isPremium && (
            <Button 
              onClick={() => navigate("/premium")}
              className="bg-amber-500 hover:bg-amber-600"
              size={isLandscapeMobile ? "sm" : "sm"}
            >
              {isLandscapeMobile ? "Premium" : "Aktivovat Premium"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
