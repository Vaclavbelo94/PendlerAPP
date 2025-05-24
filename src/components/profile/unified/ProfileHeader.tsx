
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { ShieldIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileHeader = () => {
  const { user, isPremium, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Můj profil</h1>
          <p className="text-muted-foreground">
            Spravujte své osobní údaje a nastavení
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <ShieldIcon className="h-3 w-3" />
              Administrátor
            </Badge>
          )}
          {isPremium && (
            <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
              <ShieldIcon className="h-3 w-3" />
              Premium
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 p-6 bg-card rounded-lg border">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <UserIcon className="h-8 w-8 text-primary" />
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-semibold">
            {user?.user_metadata?.username || user?.email?.split('@')[0] || 'Uživatel'}
          </h2>
          <p className="text-muted-foreground">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">
              Registrován: {user?.created_at ? new Date(user.created_at).toLocaleDateString('cs-CZ') : 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {!isPremium && (
            <Button 
              onClick={() => navigate("/premium")}
              className="bg-amber-500 hover:bg-amber-600"
              size="sm"
            >
              Aktivovat Premium
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
