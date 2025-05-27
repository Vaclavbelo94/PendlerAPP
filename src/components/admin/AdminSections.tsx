
import { Users, Settings, Crown, Key, BarChart3, Activity, Database, FileText, Shield, RefreshCw } from "lucide-react";
import { UserAdminPanel } from "./UserAdminPanel";
import { PromoCodesPanel } from "./PromoCodesPanel";
import { PasswordResetPanel } from "./PasswordResetPanel";
import { PremiumFeaturesPanel } from "./PremiumFeaturesPanel";
import AdminAnalyticsDashboard from "./analytics/AdminAnalyticsDashboard";
import SystemMonitoringPanel from "./monitoring/SystemMonitoringPanel";
import { UserManagement } from "./users/UserManagement";
import UserActivityPanel from "./users/UserActivityPanel";
import DatabasePanel from "./database/DatabasePanel";

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
    id: "users-list",
    title: "Seznam uživatelů",
    description: "Kompletní přehled a správa všech uživatelů",
    icon: <Users className="h-6 w-6" />,
    component: <UserManagement />,
    variant: "primary" as const,
    category: "user-management"
  },
  {
    id: "users-activity",
    title: "Aktivita uživatelů",
    description: "Monitoring a audit uživatelských akcí",
    icon: <Activity className="h-6 w-6" />,
    component: <UserActivityPanel />,
    variant: "secondary" as const,
    category: "user-management"
  },
  {
    id: "password-reset",
    title: "Reset hesla",
    description: "Generování a správa odkazů pro reset hesla uživatelů",
    icon: <RefreshCw className="h-6 w-6" />,
    component: <PasswordResetPanel />,
    variant: "secondary" as const,
    category: "user-management"
  },
  {
    id: "premium-features",
    title: "Premium funkce",
    description: "Konfigurace a správa prémiových funkcí aplikace",
    icon: <Crown className="h-6 w-6" />,
    component: <PremiumFeaturesPanel />,
    variant: "accent" as const,
    category: "features"
  },
  {
    id: "promo-codes",
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
    id: "system-monitoring",
    title: "Systémové monitorování",
    description: "Real-time metriky výkonu a zdraví systému",
    icon: <Activity className="h-6 w-6" />,
    component: <SystemMonitoringPanel />,
    variant: "accent" as const,
    category: "monitoring"
  },
  {
    id: "system-logs",
    title: "Systémové logy",
    description: "Monitoring a analýza systémových událostí",
    icon: <FileText className="h-6 w-6" />,
    component: <div className="p-4">Systémové logy - zatím nedostupné</div>,
    variant: "secondary" as const,
    category: "system"
  },
  {
    id: "database",
    title: "Správa databáze",
    description: "Statistiky, backup a SQL runner",
    icon: <Database className="h-6 w-6" />,
    component: <DatabasePanel />,
    variant: "accent" as const,
    category: "system"
  }
];
