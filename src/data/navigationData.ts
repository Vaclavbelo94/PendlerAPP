
import { Home, Calendar, Car, Calculator, Languages, FileText, Settings, Shield, Truck } from "lucide-react";

export interface NavigationItem {
  path: string;
  titleKey: string;
  icon: any;
  badge?: string;
  adminOnly?: boolean;
  dhlOnly?: boolean;
  dhlAdminOnly?: boolean;
}

export const navigationItems: NavigationItem[] = [
  {
    path: "/dashboard",
    titleKey: "dashboard",
    icon: Home,
  },
  {
    path: "/shifts",
    titleKey: "shifts",
    icon: Calendar,
  },
  {
    path: "/travel",
    titleKey: "travel",
    icon: Car,
  },
  {
    path: "/tax-advisor",
    titleKey: "taxAdvisor",
    icon: Calculator,
  },
  {
    path: "/language",
    titleKey: "language",
    icon: Languages,
  },
  {
    path: "/translator",
    titleKey: "translator",
    icon: FileText,
  },
  {
    path: "/settings", 
    titleKey: "settings",
    icon: Settings,
  },
  {
    path: "/admin",
    titleKey: "administration",
    icon: Shield,
    adminOnly: true,
  },
  {
    path: "/dhl-dashboard",
    titleKey: "dhlDashboard",
    icon: Truck,
    dhlOnly: true,
  },
  {
    path: "/dhl-admin",
    titleKey: "dhlAdmin", 
    icon: Truck,
    dhlAdminOnly: true,
  },
];
