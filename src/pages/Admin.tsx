import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import AdminLoginDialog from "@/components/admin/AdminLoginDialog";
import { useAuth } from "@/hooks/auth";
import { SectionHeader } from "@/components/ui/section-header";
import { InfoCard } from "@/components/ui/design-system/InfoCard";
import { AdminDashboard } from "@/components/admin/core/AdminDashboard";
import { useAdminContext } from "@/components/admin/core/AdminProvider";
import { UserManagement } from "@/components/admin/users";
import UserActivityPanel from "@/components/admin/users/UserActivityPanel";
import { PromoCodesPanel } from "@/components/admin/PromoCodesPanel";
import { PremiumFeaturesPanel } from "@/components/admin/PremiumFeaturesPanel";
import { AdManagementPanel } from "@/components/admin/AdManagementPanel";
import { PasswordResetPanel } from "@/components/admin/PasswordResetPanel";
import SystemMonitoringPanel from "@/components/admin/monitoring/SystemMonitoringPanel";
import DatabasePanel from "@/components/admin/database/DatabasePanel";
import AdminNavigation from "@/components/admin/AdminNavigation";
import { Truck, Shield } from "lucide-react";

const AdminContent = () => {
  const { currentSection, setCurrentSection } = useAdminContext();
  const [showNavigation, setShowNavigation] = useState(true);

  const renderContent = () => {
    if (showNavigation && currentSection === 'dashboard') {
      return (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Administrace</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kompletní správa aplikace s pokročilými funkcemi pro monitoring, analytics a správu uživatelů
            </p>
          </div>
          
          <AdminNavigation
            activeSection={currentSection}
            onSectionChange={(section) => {
              setCurrentSection(section);
              setShowNavigation(false);
            }}
            variant="primary"
          />
          
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6">Další nástroje</h2>
            <AdminNavigation
              activeSection={currentSection}
              onSectionChange={(section) => {
                setCurrentSection(section);
                setShowNavigation(false);
              }}
              variant="secondary"
            />
          </div>
        </div>
      );
    }

    switch (currentSection) {
      case 'users-list':
        return <UserManagement />;
      case 'users-roles':
        return <div className="p-4">Role a oprávnění - zatím nedostupné</div>;
      case 'users-activity':
        return <UserActivityPanel />;
      case 'promo-codes':
        return <PromoCodesPanel />;
      case 'premium-features':
        return <PremiumFeaturesPanel />;
      case 'ad-management':
        return <AdManagementPanel />;
      case 'system-logs':
        return <div className="p-4">Systémové logy - zatím nedostupné</div>;
      case 'system-monitoring':
        return <SystemMonitoringPanel />;
      case 'database':
        return <DatabasePanel />;
      case 'password-reset':
        return <PasswordResetPanel />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {!showNavigation && currentSection !== 'dashboard' && (
        <Button
          variant="outline"
          onClick={() => {
            setCurrentSection('dashboard');
            setShowNavigation(true);
          }}
          className="mb-4"
        >
          ← Zpět na přehled
        </Button>
      )}
      {renderContent()}
    </div>
  );
};

const Admin = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, signOut, refreshAdminStatus, user, isLoading } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isLoading) return;
      
      console.log("Checking admin status:", { user, isAdmin });
      
      // Pro admin@pendlerapp.com povolíme vždy přístup
      if (user?.email === 'admin@pendlerapp.com') {
        console.log("Admin email detected, allowing access");
        return;
      }
      
      // Pro ostatní uživatele kontrolujeme isAdmin flag
      if (!isAdmin && user) {
        // User is logged in but not admin
        setShowLoginDialog(false);
        toast.error("Nemáte administrátorská práva");
        navigate("/");
        return;
      }
      
      if (!isAdmin && !user) {
        // User is not logged in at all
        setShowLoginDialog(true);
        return;
      }
      
      if (isAdmin || user?.email === 'admin@pendlerapp.com') {
        toast.success("Přístup do administrace povolen");
      }
    };
    
    checkAdminStatus();
  }, [isAdmin, isLoading, user, navigate]);

  const handleLogout = () => {
    signOut();
    toast.info("Odhlášení z administrace proběhlo úspěšně");
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Povolit přístup pro admin@pendlerapp.com i když isAdmin není true
  const hasAdminAccess = isAdmin || user?.email === 'admin@pendlerapp.com';

  if (!hasAdminAccess) {
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

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
      <AdminContent />
    </div>
  );
};

export default Admin;
