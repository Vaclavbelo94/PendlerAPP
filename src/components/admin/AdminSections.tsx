
import { Users, Settings, Crown, Key, BarChart3, Activity } from "lucide-react";
import { UserAdminPanel } from "./UserAdminPanel";
import { PromoCodesPanel } from "./PromoCodesPanel";
import { PasswordResetPanel } from "./PasswordResetPanel";
import { PremiumFeaturesPanel } from "./PremiumFeaturesPanel";
import AdminAnalyticsDashboard from "./analytics/AdminAnalyticsDashboard";
import SystemMonitoringPanel from "./monitoring/SystemMonitoringPanel";

export const adminSections = [
  {
    id: "users",
    title: "Správa uživatelů",
    description: "Spravujte uživatelské účty, premium statusy a oprávnění",
    icon: <Users className="h-6 w-6" />,
    component: <UserAdminPanel />,
    variant: "primary" as const,
    category: "user-management"
  },
  {
    id: "reset",
    title: "Reset hesla",
    description: "Generování a správa odkazů pro reset hesla uživatelů",
    icon: <Settings className="h-6 w-6" />,
    component: <PasswordResetPanel />,
    variant: "secondary" as const,
    category: "user-management"
  },
  {
    id: "premium",
    title: "Premium funkce",
    description: "Konfigurace a správa prémiových funkcí aplikace",
    icon: <Crown className="h-6 w-6" />,
    component: <PremiumFeaturesPanel />,
    variant: "accent" as const,
    category: "features"
  },
  {
    id: "promo",
    title: "Promo kódy",
    description: "Vytváření, správa a analýza promocijních kódů",
    icon: <Key className="h-6 w-6" />,
    component: <PromoCodesPanel />,
    variant: "secondary" as const,
    category: "features"
  },
  {
    id: "analytics",
    title: "Analytika",
    description: "Pokročilé analytické přehledy a reporty",
    icon: <BarChart3 className="h-6 w-6" />,
    component: <AdminAnalyticsDashboard />,
    variant: "primary" as const,
    category: "monitoring"
  },
  {
    id: "monitoring",
    title: "Systémové monitorování",
    description: "Real-time metriky výkonu a zdraví systému",
    icon: <Activity className="h-6 w-6" />,
    component: <SystemMonitoringPanel />,
    variant: "accent" as const,
    category: "monitoring"
  }
];
