
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  Languages, 
  BookOpenIcon, 
  CarFrontIcon, 
  CalendarClockIcon, 
  InfoIcon, 
  HelpCircleIcon, 
  PhoneIcon, 
  X
} from "lucide-react";

interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar = ({ closeSidebar }: SidebarProps) => {
  const location = useLocation();
  
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

  return (
    <div className="h-full w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
            PH
          </div>
          <span className="font-poppins font-bold text-lg text-gray-800">Pendler Helper</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={closeSidebar} className="lg:hidden">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground pl-4 pb-1">Hlavní navigace</p>
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start gap-3 ${
                    location.pathname === item.path
                      ? "font-medium"
                      : "font-normal"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
          
          <Separator />
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground pl-4 pb-1">Informace</p>
            {secondaryItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start gap-3 ${
                    location.pathname === item.path
                      ? "font-medium"
                      : "font-normal"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-sm font-medium">Přihlášení</p>
          <p className="text-xs text-muted-foreground mb-2">Přihlašte se pro více možností</p>
          <div className="grid gap-2">
            <Link to="/login">
              <Button size="sm" variant="default" className="w-full">Přihlásit se</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" variant="outline" className="w-full">Registrovat</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
