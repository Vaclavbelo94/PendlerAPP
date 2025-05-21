
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAdminPanel } from "@/components/admin/UserAdminPanel";
import { PromoCodesPanel } from "@/components/admin/PromoCodesPanel";
import { PasswordResetPanel } from "@/components/admin/PasswordResetPanel";
import { PremiumFeaturesPanel } from "@/components/admin/PremiumFeaturesPanel";
import AdminLoginDialog from "@/components/admin/AdminLoginDialog";
import { useAuth } from "@/hooks/useAuth";

const Admin = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, signOut, refreshAdminStatus, user } = useAuth();
  
  console.log("Admin page - User:", user?.email);
  console.log("Admin page - isAdmin status on load:", isAdmin);

  // Při načtení stránky aktualizujeme admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log("Admin page - Refreshing admin status...");
      await refreshAdminStatus();
      console.log("Admin page - Admin status after refresh:", isAdmin);
      
      // If still not admin after refresh, show login dialog
      if (!isAdmin) {
        console.log("Admin page - User is not admin after refresh, showing login dialog");
        setShowLoginDialog(true);
      } else {
        console.log("Admin page - Admin status confirmed");
        toast.success("Přístup do administrace povolen");
      }
    };
    
    checkAdminStatus();
  }, [refreshAdminStatus]);

  // Redirect na hlavní stránku, pokud uživatel není admin
  useEffect(() => {
    if (!isAdmin) {
      console.log("Admin page - User is not admin, showing login dialog");
      setShowLoginDialog(true);
    }
  }, [isAdmin]);

  const handleLogout = () => {
    signOut();
    toast.info("Odhlášení z administrace proběhlo úspěšně");
    navigate("/");
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Administrace</h1>
            <p className="text-muted-foreground">
              Správa uživatelů, promo kódů a hesel
            </p>
          </div>
          
          {isAdmin && (
            <button
              onClick={handleLogout}
              className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-md text-sm font-medium"
            >
              Odhlásit z administrace
            </button>
          )}
        </div>

        {isAdmin ? (
          <Tabs defaultValue="promo" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users">Uživatelé</TabsTrigger>
              <TabsTrigger value="premium">Premium funkce</TabsTrigger>
              <TabsTrigger value="promo">Promo kódy</TabsTrigger>
              <TabsTrigger value="reset">Reset hesla</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Správa uživatelů</CardTitle>
                  <CardDescription>
                    Zde můžete spravovat uživatelské účty a jejich premium status.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserAdminPanel />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="premium" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Správa premium funkcí</CardTitle>
                  <CardDescription>
                    Nastavte, které funkce aplikace budou dostupné pouze premium uživatelům.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PremiumFeaturesPanel />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="promo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Správa promo kódů</CardTitle>
                  <CardDescription>
                    Vytvářejte a spravujte promo kódy pro předplatné premium funkcí.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PromoCodesPanel />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reset" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reset hesla</CardTitle>
                  <CardDescription>
                    Generování odkazů pro reset hesla uživatelů.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PasswordResetPanel />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Přístup omezen</CardTitle>
              <CardDescription>
                Pro přístup k administraci je nutné se přihlásit s administrátorskými právy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button
                onClick={() => setShowLoginDialog(true)}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Přihlásit se jako administrátor
              </button>
            </CardContent>
          </Card>
        )}
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
