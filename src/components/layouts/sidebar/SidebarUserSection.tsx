
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LogOut, 
  User, 
  Settings, 
  CreditCard,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface SidebarUserSectionProps {
  closeSidebar: () => void;
}

const SidebarUserSection = ({ closeSidebar }: SidebarUserSectionProps) => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Debug output
  console.log("SidebarUserSection - User:", user);
  console.log("SidebarUserSection - isAdmin status:", isAdmin);

  const handleLogout = async () => {
    await signOut();
    closeSidebar(); // Zavřít sidebar po odhlášení
    navigate("/"); // Přesměrovat na domovskou stránku
  };

  if (!user) {
    return (
      <div className="p-4">
        <div className="flex flex-col space-y-2">
          <Link to="/login" onClick={closeSidebar}>
            <Button variant="outline" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Přihlásit se
            </Button>
          </Link>
          <Link to="/register" onClick={closeSidebar}>
            <Button variant="default" className="w-full justify-start">
              <CreditCard className="mr-2 h-4 w-4" />
              Registrace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          {user.user_metadata?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <p className="text-sm font-medium text-sidebar-foreground">
            {user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel'}
          </p>
          <p className="text-xs text-sidebar-foreground/70">
            {user.email || ''}
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        <Link to="/profile-extended" onClick={closeSidebar}>
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Profil
          </Button>
        </Link>
        <Link to="/profile-extended?tab=settings" onClick={closeSidebar}>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Nastavení
          </Button>
        </Link>
        {isAdmin && (
          <Link to="/admin" onClick={closeSidebar}>
            <Button variant="ghost" className="w-full justify-start bg-red-500/10 hover:bg-red-500/20">
              <Shield className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-red-500">Administrace</span>
            </Button>
          </Link>
        )}
        <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Odhlásit se
        </Button>
      </div>
    </div>
  );
};

export default SidebarUserSection;
