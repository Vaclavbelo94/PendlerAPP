
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Users, Settings, Key, ShieldCheck } from "lucide-react";
import { UserAdminPanel } from "@/components/admin/UserAdminPanel";
import { PromoCodesPanel } from "@/components/admin/PromoCodesPanel";
import { PasswordResetPanel } from "@/components/admin/PasswordResetPanel";
import { PremiumFeaturesPanel } from "@/components/admin/PremiumFeaturesPanel";
import AdminLoginDialog from "@/components/admin/AdminLoginDialog";
import { useAuth } from "@/hooks/useAuth";
import { SectionHeader } from "@/components/ui/section-header";
import { InfoCard } from "@/components/ui/design-system/InfoCard";

const Admin = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
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

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Administrace</h1>
            <p className="text-muted-foreground">
              Správa uživatelů, promo kódů a systémových nastavení
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 max-w-md">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Uživatelé
          </TabsTrigger>
          <TabsTrigger value="premium" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Premium
          </TabsTrigger>
          <TabsTrigger value="promo" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Promo kódy
          </TabsTrigger>
          <TabsTrigger value="reset" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Reset hesla
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-6">
          <InfoCard
            title="Správa uživatelů"
            description="Zde můžete spravovat uživatelské účty a jejich premium status."
            icon={<Users className="h-5 w-5" />}
            variant="primary"
          >
            <UserAdminPanel />
          </InfoCard>
        </TabsContent>
        
        <TabsContent value="premium" className="space-y-6">
          <InfoCard
            title="Správa premium funkcí"
            description="Nastavte, které funkce aplikace budou dostupné pouze premium uživatelům."
            icon={<Crown className="h-5 w-5" />}
            variant="accent"
          >
            <PremiumFeaturesPanel />
          </InfoCard>
        </TabsContent>
        
        <TabsContent value="promo" className="space-y-6">
          <InfoCard
            title="Správa promo kódů"
            description="Vytvářejte a spravujte promo kódy pro předplatné premium funkcí."
            icon={<Key className="h-5 w-5" />}
            variant="secondary"
          >
            <PromoCodesPanel />
          </InfoCard>
        </TabsContent>
        
        <TabsContent value="reset" className="space-y-6">
          <InfoCard
            title="Reset hesla"
            description="Generování odkazů pro reset hesla uživatelů."
            icon={<Settings className="h-5 w-5" />}
            variant="muted"
          >
            <PasswordResetPanel />
          </InfoCard>
        </TabsContent>
      </Tabs>
      
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
