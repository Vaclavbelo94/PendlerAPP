import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarUserSectionProps {
  closeSidebar: () => void;
  isCompact?: boolean;
}

const SidebarUserSection = ({ closeSidebar, isCompact = false }: SidebarUserSectionProps) => {
  const navigate = useNavigate();
  const { user, isPremium, signOut } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  const handleLogout = async () => {
    await signOut();
    closeSidebar();
  };

  if (!user) {
    return (
      <div className={`${isCompact ? 'p-2' : 'p-4'} space-y-2 border-t border-sidebar-border`}>
        <Button 
          variant="outline" 
          size={isCompact ? "sm" : "default"}
          onClick={() => handleNavigation('/login')}
          className="w-full"
        >
          Přihlášení
        </Button>
        <Button 
          variant="default" 
          size={isCompact ? "sm" : "default"}
          onClick={() => handleNavigation('/register')}
          className="w-full"
        >
          Registrace
        </Button>
      </div>
    );
  }

  // Kompaktní layout pro landscape sheet
  if (isCompact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-2 bg-sidebar-accent/50 rounded-md">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              {user.email}
            </p>
            {isPremium && (
              <div className="flex items-center gap-1">
                <Crown className="h-3 w-3 text-amber-500" />
                <span className="text-xs text-amber-600 dark:text-amber-400">Premium</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation('/profile')}
            className="text-xs h-7"
          >
            <User className="h-3 w-3 mr-1" />
            Profil
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs h-7"
          >
            <LogOut className="h-3 w-3 mr-1" />
            Odhlásit
          </Button>
        </div>
      </div>
    );
  }

  // Původní layout
  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {user.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {user.email}
          </p>
          {isPremium && (
            <div className="flex items-center gap-1">
              <Crown className="h-3 w-3 text-amber-500" />
              <span className="text-xs text-amber-600 dark:text-amber-400">Premium</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavigation('/profile')}
          className="w-full justify-start text-sidebar-foreground"
        >
          <User className="h-4 w-4 mr-3" />
          Profil
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Odhlásit se
        </Button>
      </div>
    </div>
  );
};

export default SidebarUserSection;
