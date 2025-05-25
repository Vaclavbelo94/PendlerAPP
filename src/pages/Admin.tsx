
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Users, Settings, Key, ShieldCheck, BarChart3, FileText, Activity, RefreshCw } from "lucide-react";
import { UserAdminPanel } from "@/components/admin/UserAdminPanel";
import { PromoCodesPanel } from "@/components/admin/PromoCodesPanel";
import { PasswordResetPanel } from "@/components/admin/PasswordResetPanel";
import { PremiumFeaturesPanel } from "@/components/admin/PremiumFeaturesPanel";
import AdminAnalyticsDashboard from "@/components/admin/analytics/AdminAnalyticsDashboard";
import SystemLogsPanel from "@/components/admin/logs/SystemLogsPanel";
import SystemMonitoringPanel from "@/components/admin/monitoring/SystemMonitoringPanel";
import AdminLoginDialog from "@/components/admin/AdminLoginDialog";
import { useAuth } from "@/hooks/useAuth";
import { SectionHeader } from "@/components/ui/section-header";
import { InfoCard } from "@/components/ui/design-system/InfoCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Admin = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAdmin, signOut, refreshAdminStatus, user, isLoading } = useAuth();

  // Při načtení stránky kontrolujeme admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isLoading) return;
      
      if (!isAdmin) {
        setShowLoginDialog(true);
      } else {
        toast.success("Přístup do administrace povolen");
      }
    };
    
    checkAdminStatus();
  }, [isAdmin, isLoading]);

  const handleLogout = () => {
    signOut();
    toast.info("Odhlášení z administrace proběhlo úspěšně");
    navigate("/");
  };

  // Pokud se admin status ještě načítá, zobrazíme loading
  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-8 max-w-4xl">
        <SectionHeader
          title="Administrace"
          description="Pro přístup k administraci je nutné se přihlásit s administrátorskými právy."
        />
        
        <InfoCard
          title="Přístup omezen"
          description="Přihlašte se prosím jako administrátor pro pokračování."
          icon={<ShieldCheck className="h-5 w-5" />}
          variant="muted"
          footer={
            <Button
              onClick={() => setShowLoginDialog(true)}
              className="w-full"
            >
              Přihlásit se jako administrátor
            </Button>
          }
        />
        
        <AdminLoginDialog 
          isOpen={showLoginDialog} 
          onClose={() => navigate("/")}
          onSuccess={() => {
            setShowLoginDialog(false);
            toast.success("Přihlášení do administrace úspěšné");
          }}
        />
      </div>
    );
  }

  const adminSections = [
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
      id: "logs",
      title: "Systémové logy",
      description: "Monitoring a debugování systémových událostí",
      icon: <FileText className="h-6 w-6" />,
      component: <SystemLogsPanel />,
      variant: "secondary" as const,
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

  const categories = {
    "user-management": {
      title: "Správa uživatelů",
      description: "Nástroje pro správu uživatelských účtů a oprávnění"
    },
    "features": {
      title: "Funkce a konfigurace",
      description: "Nastavení aplikačních funkcí a promocí"
    },
    "monitoring": {
      title: "Monitoring a analýza",
      description: "Sledování výkonu a analýza dat"
    }
  };

  if (activeSection) {
    const section = adminSections.find(s => s.id === activeSection);
    return (
      <div className="container py-6 md:py-10 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Button 
                variant="ghost" 
                onClick={() => setActiveSection(null)}
                className="mb-4 text-muted-foreground hover:text-foreground"
              >
                ← Zpět na přehled
              </Button>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{section?.title}</h1>
              <p className="text-muted-foreground">
                {section?.description}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Admin režim
              </Badge>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Odhlásit se
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {section?.component}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Administrace</h1>
            <p className="text-muted-foreground">
              Kompletní správa aplikace s pokročilými funkcemi pro monitoring, analytics a správu uživatelů
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Admin režim ({user?.email})
            </Badge>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Obnovit
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Odhlásit se
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktivní uživatelé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% oproti minulému měsíci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Premium uživatelé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">7.2% konverzní poměr</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Systémový stav</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.8%</div>
            <p className="text-xs text-muted-foreground">Dostupnost</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Sections by Category */}
      {Object.entries(categories).map(([categoryKey, category]) => (
        <div key={categoryKey} className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-1">{category.title}</h2>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminSections
              .filter(section => section.category === categoryKey)
              .map((section) => (
                <Card
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className="group relative cursor-pointer hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        section.variant === 'primary' ? 'bg-primary/10 text-primary' :
                        section.variant === 'accent' ? 'bg-accent/10 text-accent' :
                        section.variant === 'secondary' ? 'bg-secondary/10 text-secondary' :
                        'bg-muted/20 text-muted-foreground'
                      }`}>
                        {section.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{section.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{section.description}</CardDescription>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </div>
      ))}

      <AdminLoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => !isAdmin && navigate("/")}
        onSuccess={() => {
          setShowLoginDialog(false);
          toast.success("Přihlášení do administrace úspěšné");
        }}
      />
    </div>
  );
};

export default Admin;
