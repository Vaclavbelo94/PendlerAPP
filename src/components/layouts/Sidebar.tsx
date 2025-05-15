
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  HomeIcon, 
  Languages, 
  BookOpenIcon, 
  CarFrontIcon, 
  CalendarClockIcon, 
  InfoIcon, 
  HelpCircleIcon, 
  PhoneIcon, 
  X,
  Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar = ({ closeSidebar }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, user, isPremium } = useAuth();
  
  const navItems = [
    { title: "Domů", path: "/", icon: HomeIcon },
    { title: "Výuka němčiny", path: "/language", icon: Languages },
    { title: "Překladač", path: "/translator", icon: Languages },
    { title: "Přehled zákonů", path: "/laws", icon: BookOpenIcon },
    { title: "Správa vozidla", path: "/vehicle", icon: CarFrontIcon },
    { title: "Plánování směn", path: "/shifts", icon: CalendarClockIcon },
  ];
  
  const secondaryItems = [
    { title: "O projektu", path: "/about", icon: InfoIcon },
    { title: "Často kladené otázky", path: "/faq", icon: HelpCircleIcon },
    { title: "Kontakt", path: "/contact", icon: PhoneIcon },
  ];

  // Funkce pro navigaci - opraveno aby nedocházelo k refreshi stránky
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

  // Zavřít sidebar po kliknutí na odkaz na mobilních zařízeních
  const handleLinkClick = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <div className="h-full w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <div onClick={handleNavigate("/")} className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
            PH
          </div>
          <span className="font-poppins font-bold text-lg text-gray-800">Pendler Helper</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={(e) => {
            e.stopPropagation();
            closeSidebar();
          }} 
          className="lg:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground pl-4 pb-1">Hlavní navigace</p>
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                size="sm"
                className={`w-full justify-start gap-3 ${
                  location.pathname === item.path
                    ? "font-medium"
                    : "font-normal"
                }`}
                onClick={handleNavigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </div>
          
          <Separator />
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground pl-4 pb-1">Informace</p>
            {secondaryItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                size="sm"
                className={`w-full justify-start gap-3 ${
                  location.pathname === item.path
                    ? "font-medium"
                    : "font-normal"
                }`}
                onClick={handleNavigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
      <Separator />
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
        
        <div className="bg-slate-50 rounded-lg p-3 mt-2">
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
                  onClick={() => {
                    closeSidebar();
                    const { signOut } = require('@/hooks/useAuth').useAuth();
                    signOut();
                  }}
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
    </div>
  );
};

export default Sidebar;
