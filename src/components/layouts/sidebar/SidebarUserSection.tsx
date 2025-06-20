
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Crown, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

interface SidebarUserSectionProps {
  closeSidebar: () => void;
  isCompact?: boolean;
}

const SidebarUserSection = ({ closeSidebar, isCompact = false }: SidebarUserSectionProps) => {
  const navigate = useNavigate();
  const { user, isPremium, signOut } = useAuth();
  const { t } = useLanguage();

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
      <div className={`${isCompact ? 'p-2' : 'p-4'} space-y-2 border-t border-sidebar-border/30`}>
        <Button 
          variant="outline" 
          size={isCompact ? "sm" : "default"}
          onClick={() => handleNavigation('/login')}
          className="w-full bg-gradient-to-r from-sidebar-accent/20 to-sidebar-accent/10 border-sidebar-border/50 hover:from-primary/20 hover:to-accent/20 hover:border-primary/30 transition-all duration-300"
        >
          {t('login')}
        </Button>
        <Button 
          variant="default" 
          size={isCompact ? "sm" : "default"}
          onClick={() => handleNavigation('/register')}
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          {t('registerCreateAccount')}
        </Button>
      </div>
    );
  }

  // Kompaktní layout pro landscape sheet
  if (isCompact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-sidebar-accent/30 to-sidebar-accent/10 rounded-lg border border-sidebar-border/30 backdrop-blur-sm">
          <Avatar className="h-6 w-6 ring-2 ring-primary/30">
            <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-accent/20 font-medium">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              {user.email}
            </p>
            {isPremium && (
              <div className="flex items-center gap-1">
                <Crown className="h-3 w-3 text-amber-500 animate-pulse" />
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">{t('premium')}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation('/profile')}
            className="text-xs h-7 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-300"
          >
            <User className="h-3 w-3 mr-1" />
            {t('profile')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs h-7 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 transition-all duration-300"
          >
            <LogOut className="h-3 w-3 mr-1" />
            {t('logout')}
          </Button>
        </div>
      </div>
    );
  }

  // Původní layout s vylepšeným stylingem
  return (
    <div className="p-4 border-t border-sidebar-border/30">
      <div className="flex items-center gap-3 mb-3 p-3 bg-gradient-to-r from-sidebar-accent/30 to-sidebar-accent/10 rounded-lg border border-sidebar-border/30 backdrop-blur-sm">
        <Avatar className="h-8 w-8 ring-2 ring-primary/30 transition-all duration-300 hover:ring-primary/50 hover:scale-110">
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 font-medium">
            {user.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {user.email}
          </p>
          {isPremium && (
            <div className="flex items-center gap-1 mt-1">
              <Crown className="h-3 w-3 text-amber-500 animate-pulse" />
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">{t('premium')} účet</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavigation('/profile')}
          className="w-full justify-start text-sidebar-foreground hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-blue-600/20 hover:scale-[1.02] transition-all duration-300 group"
        >
          <User className="h-4 w-4 mr-3 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110" />
          <span className="font-medium">{t('profile')}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 hover:scale-[1.02] transition-all duration-300 group"
        >
          <LogOut className="h-4 w-4 mr-3 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110" />
          <span className="font-medium">{t('logout')}</span>
        </Button>
      </div>
    </div>
  );
};

export default SidebarUserSection;
