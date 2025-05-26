import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import AdminLoginDialog from "@/components/admin/AdminLoginDialog";
import { useAuth } from "@/hooks/useAuth";
import { SectionHeader } from "@/components/ui/section-header";
import { InfoCard } from "@/components/ui/design-system/InfoCard";
import { AdminLayout } from "@/components/admin/core/AdminLayout";
import { AdminDashboard } from "@/components/admin/core/AdminDashboard";
import { useAdminContext } from "@/components/admin/core/AdminProvider";
import { UserManagement } from "@/components/admin/users";
import { PromoCodesPanel } from "@/components/admin/PromoCodesPanel";
import { PremiumFeaturesPanel } from "@/components/admin/PremiumFeaturesPanel";
import SystemMonitoringPanel from "@/components/admin/monitoring/SystemMonitoringPanel";

const AdminContent = () => {
  const { currentSection } = useAdminContext();

  const renderContent = () => {
    switch (currentSection) {
      case 'users-list':
        return <UserManagement />;
      case 'promo-codes':
        return <PromoCodesPanel />;
      case 'premium-features':
        return <PremiumFeaturesPanel />;
      case 'system-monitoring':
        return <SystemMonitoringPanel />;
      default:
        return <AdminDashboard />;
    }
  };

  return renderContent();
};

const Admin = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, signOut, refreshAdminStatus, user, isLoading } = useAuth();

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

  return (
    <AdminLayout>
      <AdminContent />
      
      <AdminLoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => !isAdmin && navigate("/")}
        onSuccess={() => {
          setShowLoginDialog(false);
          toast.success("Přihlášení do administrace úspěšné");
        }}
      />
    </AdminLayout>
  );
};

export default Admin;
