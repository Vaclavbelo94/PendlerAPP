
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import AdminLoginDialog from "@/components/admin/AdminLoginDialog";
import { useAuth } from "@/hooks/useAuth";
import { SectionHeader } from "@/components/ui/section-header";
import { InfoCard } from "@/components/ui/design-system/InfoCard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminQuickStats } from "@/components/admin/AdminQuickStats";
import { AdminCategories } from "@/components/admin/AdminCategories";
import { AdminSectionView } from "@/components/admin/AdminSectionView";
import { adminSections } from "@/components/admin/AdminSections";

const Admin = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
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

  const handleRefresh = () => {
    window.location.reload();
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

  const activeAdminSection = adminSections.find(s => s.id === activeSection);

  if (activeSection && activeAdminSection) {
    return (
      <AdminSectionView
        section={activeAdminSection}
        userEmail={user?.email}
        onBack={() => setActiveSection(null)}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <AdminHeader 
        userEmail={user?.email}
        onLogout={handleLogout}
        onRefresh={handleRefresh}
      />

      <AdminQuickStats />

      <AdminCategories 
        adminSections={adminSections}
        onSectionClick={setActiveSection}
      />

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
