
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Truck, ShieldCheck, Users, Calendar, Settings } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { SectionHeader } from "@/components/ui/section-header";
import { InfoCard } from "@/components/ui/design-system/InfoCard";
import { canAccessDHLAdminSync } from "@/utils/dhlAuthUtils";
import AdminLoginDialog from "@/components/admin/AdminLoginDialog";
import DHLImportPanel from "@/components/dhl/admin/DHLImportPanel";
import ExcelImportPanel from "@/components/dhl/admin/ExcelImportPanel";
import DHLEmployeeManagement from "@/components/dhl/admin/DHLEmployeeManagement";
import DHLSystemSettings from "@/components/dhl/admin/DHLSystemSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimplifiedDHLAdmin from "@/components/dhl/admin/simplified/SimplifiedDHLAdmin";
import DHLDashboard from "@/components/dhl/admin/DHLDashboard";
import ShiftCalendar from "@/components/dhl/admin/ShiftCalendar";
import EnhancedNavigation from "@/components/dhl/admin/EnhancedNavigation";
import EmployeeTimeline from '@/components/dhl/admin/EmployeeTimeline';
import ReportsGenerator from '@/components/dhl/admin/ReportsGenerator';
import BulkOperations from '@/components/dhl/admin/BulkOperations';
import ShiftConflictDetector from '@/components/dhl/admin/ShiftConflictDetector';
import ShiftTemplateManager from '@/components/dhl/admin/ShiftTemplateManager';

const DHLAdmin = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();

  const handleRefresh = () => {
    window.location.reload();
  };

  const hasAccess = canAccessDHLAdminSync(user);

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

  return <SimplifiedDHLAdmin />;
};

export default DHLAdmin;
