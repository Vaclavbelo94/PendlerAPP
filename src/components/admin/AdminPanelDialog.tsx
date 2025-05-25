import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Settings, BarChart3, Database } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { UserAdminPanel } from "./UserAdminPanel";
import { PremiumFeaturesPanel } from "./PremiumFeaturesPanel";
import { PromoCodesPanel } from "./PromoCodesPanel";

const AdminPanelDialog = () => {
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Shield className="h-4 w-4" />
          Admin Panel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Administrační panel
          </DialogTitle>
          <DialogDescription>
            Správa uživatelů, funkcí a nastavení aplikace
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Uživatelé
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Funkce
            </TabsTrigger>
            <TabsTrigger value="promo" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Promo kódy
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Databáze
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <UserAdminPanel />
          </TabsContent>
          
          <TabsContent value="features" className="space-y-4">
            <PremiumFeaturesPanel />
          </TabsContent>
          
          <TabsContent value="promo" className="space-y-4">
            <PromoCodesPanel />
          </TabsContent>
          
          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Statistiky databáze</CardTitle>
                <CardDescription>
                  Přehled využití databáze a výkonu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">1,234</div>
                    <div className="text-sm text-muted-foreground">Celkem uživatelů</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">5,678</div>
                    <div className="text-sm text-muted-foreground">Směny</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">89%</div>
                    <div className="text-sm text-muted-foreground">Aktivní uživatelé</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">12MB</div>
                    <div className="text-sm text-muted-foreground">Velikost DB</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanelDialog;
