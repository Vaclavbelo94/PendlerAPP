
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Users, Settings, Key, ShieldCheck, BarChart3, FileText, Activity } from "lucide-react";
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
      title: "Uživatelé",
      description: "Správa uživatelských účtů",
      icon: <Users className="h-6 w-6" />,
      component: <UserAdminPanel />,
      variant: "primary" as const
    },
    {
      id: "premium",
      title: "Premium",
      description: "Správa prémiových funkcí",
      icon: <Crown className="h-6 w-6" />,
      component: <PremiumFeaturesPanel />,
      variant: "accent" as const
    },
    {
      id: "promo",
      title: "Promo kódy",
      description: "Vytváření a správa promo kódů",
      icon: <Key className="h-6 w-6" />,
      component: <PromoCodesPanel />,
      variant: "secondary" as const
    },
    {
      id: "reset",
      title: "Reset hesla",
      description: "Generování odkazů pro reset",
      icon: <Settings className="h-6 w-6" />,
      component: <PasswordResetPanel />,
      variant: "muted" as const
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "Pokročilé analytické přehledy",
      icon: <BarChart3 className="h-6 w-6" />,
      component: <AdminAnalyticsDashboard />,
      variant: "primary" as const
    },
    {
      id: "logs",
      title: "Systémové logy",
      description: "Monitoring a debugování",
      icon: <FileText className="h-6 w-6" />,
      component: <SystemLogsPanel />,
      variant: "secondary" as const
    },
    {
      id: "monitoring",
      title: "System Monitoring",
      description: "Real-time systémové metriky",
      icon: <Activity className="h-6 w-6" />,
      component: <SystemMonitoringPanel />,
      variant: "accent" as const
    }
  ];

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
            <h1 className="text-3xl font-bold tracking-tight mb-2">Pokročilá administrace</h1>
            <p className="text-muted-foreground">
              Kompletní správa aplikace s pokročilými funkcemi pro monitoring, analytics a systémové logy
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

      {/* Main Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {adminSections.map((section) => (
          <div
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className="group relative p-6 bg-card border rounded-lg cursor-pointer hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`p-3 rounded-full ${
                section.variant === 'primary' ? 'bg-primary/10 text-primary' :
                section.variant === 'accent' ? 'bg-accent/10 text-accent' :
                section.variant === 'secondary' ? 'bg-secondary/10 text-secondary' :
                'bg-muted/20 text-muted-foreground'
              }`}>
                {section.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

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
