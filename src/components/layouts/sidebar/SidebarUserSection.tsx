
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";

interface SidebarUserSectionProps {
  closeSidebar: () => void;
}

const SidebarUserSection: React.FC<SidebarUserSectionProps> = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const { isAdmin, user, isPremium, signOut } = useAuth();
  
  const handleNavigate = (path: string) => (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    navigate(path);
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      closeSidebar();
    }
  };
  
  const handleSignOut = () => {
    closeSidebar();
    signOut();
  };
  
  return (
    <div className="p-4">
      {/* Admin tlačítko v levém dolním rohu - pouze pro administrátory, když jsou přihlášeni */}
      {user && isAdmin && (
        <Button 
          variant={location.pathname === "/admin" ? "secondary" : "outline"}
          size="sm"
          className="w-full justify-start gap-3 mb-4"
          onClick={handleNavigate("/admin")}
        >
          <Shield className="h-4 w-4" />
          <span className="font-medium">Admin</span>
          <span className="ml-auto h-2 w-2 rounded-full bg-green-500" />
        </Button>
      )}
      
      <div className="bg-sidebar-accent rounded-lg p-3 mt-2">
        {user ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel'}
              </p>
              {isPremium && <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded">Premium</span>}
            </div>
            <div className="grid gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={handleNavigate("/profile")}
              >
                Profil
              </Button>
              <Button 
                size="sm" 
                variant="default" 
                className="w-full"
                onClick={handleSignOut}
              >
                Odhlásit se
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium">Přihlášení</p>
            <p className="text-xs text-muted-foreground mb-2">Přihlašte se pro více možností</p>
            <div className="grid gap-2">
              <Button 
                size="sm" 
                variant="default" 
                className="w-full"
                onClick={handleNavigate("/login")}
              >
                Přihlásit se
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={handleNavigate("/register")}
              >
                Registrovat
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SidebarUserSection;
