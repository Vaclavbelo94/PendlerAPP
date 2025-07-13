
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Truck, ShieldCheck, Users, Calendar, Settings } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { SectionHeader } from "@/components/ui/section-header";
import { InfoCard } from "@/components/ui/design-system/InfoCard";
import { canAccessDHLAdmin } from "@/utils/dhlAuthUtils";
import AdminLoginDialog from "@/components/admin/AdminLoginDialog";
import DHLImportPanel from "@/components/dhl/admin/DHLImportPanel";
import ExcelImportPanel from "@/components/dhl/admin/ExcelImportPanel";
import DHLEmployeeManagement from "@/components/dhl/admin/DHLEmployeeManagement";
import DHLSystemSettings from "@/components/dhl/admin/DHLSystemSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DHLAdminMobileCarousel from "@/components/dhl/admin/DHLAdminMobileCarousel";
import DHLDashboard from "@/components/dhl/admin/DHLDashboard";
import ShiftCalendar from "@/components/dhl/admin/ShiftCalendar";
import EnhancedNavigation from "@/components/dhl/admin/EnhancedNavigation";

const DHLAdmin = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();

  const hasAccess = canAccessDHLAdmin(user);

  useEffect(() => {
    if (isLoading) return;
    
    console.log("Checking DHL admin access:", { user: user?.email, hasAccess });
    
    if (!hasAccess && user) {
      // User is logged in but not DHL admin
      setShowLoginDialog(false);
      toast.error("Nemáte DHL administrátorská práva");
      navigate("/");
      return;
    }
    
    if (!hasAccess && !user) {
      // User is not logged in at all
      setShowLoginDialog(true);
      return;
    }
    
    if (hasAccess) {
      toast.success("Přístup do DHL administrace povolen");
    }
  }, [hasAccess, isLoading, user, navigate]);

  const handleLogout = () => {
    signOut();
    toast.info("Odhlášení z DHL administrace proběhlo úspěšně");
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="container py-8 max-w-4xl">
        <SectionHeader
          title="DHL Administrace"
          description="Pro přístup k DHL administraci je nutné se přihlásit s DHL administrátorskými právy."
        />
        
        <InfoCard
          title="Přístup omezen"
          description="Přihlašte se prosím jako DHL administrátor pro pokračování."
          icon={<Truck className="h-5 w-5 text-yellow-600" />}
          variant="muted"
          footer={
            <Button
              onClick={() => setShowLoginDialog(true)}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              <Truck className="h-4 w-4 mr-2" />
              Přihlásit se jako DHL administrátor
            </Button>
          }
        />
        
        <AdminLoginDialog 
          isOpen={showLoginDialog} 
          onClose={() => navigate("/")}
          onSuccess={() => {
            setShowLoginDialog(false);
            toast.success("Přihlášení do DHL administrace úspěšné");
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
      <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-600 rounded-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">DHL Administrace</h1>
              <p className="text-muted-foreground">
                Správa DHL systému pro zaměstnance a rozvrhy
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
          >
            Odhlásit se
          </Button>
        </div>

        {/* Welcome Card */}
        <InfoCard
          title={`Vítejte, ${user?.email}`}
          description="Máte přístup k DHL administraci. Zde můžete spravovat DHL zaměstnance, rozvrhy a systémové nastavení."
          icon={<ShieldCheck className="h-5 w-5 text-yellow-600" />}
          variant="primary"
          className="mb-8 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20"
        />

        {/* Enhanced Navigation */}
        <EnhancedNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Enhanced Admin Panel */}
        {activeTab === 'dashboard' ? (
          <DHLDashboard />
        ) : activeTab === 'calendar' ? (
          <ShiftCalendar />
        ) : (
          <DHLAdminMobileCarousel activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        {/* Admin Info */}
        <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Poznámka:</strong> Toto je DHL administrátorský panel. 
            Máte přístup pouze k DHL specifickým funkcím a nastavením.
            Pro přístup k hlavní administraci použijte účet admin@pendlerapp.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DHLAdmin;
