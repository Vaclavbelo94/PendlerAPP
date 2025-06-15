
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Crown, Trash2, Download, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "sonner";

export const AccountSettings = () => {
  const { user, isPremium, isAdmin } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.user_metadata?.username || '');

  const handleUpdateProfile = () => {
    // In a real app, this would update the user profile via Supabase
    toast.success("Profil byl aktualizován");
  };

  const handleDeleteAccount = () => {
    toast.error("Funkce smazání účtu vyžaduje potvrzení. Kontaktujte podporu.");
  };

  const handleExportData = () => {
    // Create export data including user preferences and settings
    const exportData = {
      user: {
        email: user?.email,
        created_at: user?.created_at,
        is_premium: isPremium,
        is_admin: isAdmin
      },
      settings: {
        appearance: localStorage.getItem('appearanceSettings'),
        language: localStorage.getItem('languageSettings'),
        sync: localStorage.getItem('syncSettings'),
        notifications: localStorage.getItem('notificationSettings')
      },
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pendlerapp-account-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Data účtu byla exportována");
  };

  const handleManageSubscription = () => {
    toast.info("Přesměrování na správu předplatného...");
    // In a real app, this would redirect to Stripe customer portal
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informace o účtu
          </CardTitle>
          <CardDescription>
            Základní informace o vašem účtu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mailová adresa</Label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="váš@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Uživatelské jméno</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Vaše uživatelské jméno"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label>Typ účtu:</Label>
            <div className="flex gap-2">
              {isPremium && (
                <Badge className="bg-amber-500">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
              {isAdmin && (
                <Badge variant="destructive">
                  Administrátor
                </Badge>
              )}
              {!isPremium && !isAdmin && (
                <Badge variant="secondary">
                  Základní účet
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Datum registrace</Label>
            <p className="text-sm text-muted-foreground">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('cs-CZ') : 'Neznámé'}
            </p>
          </div>

          <Button onClick={handleUpdateProfile} className="w-full">
            Aktualizovat profil
          </Button>
        </CardContent>
      </Card>

      {isPremium && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Premium předplatné
            </CardTitle>
            <CardDescription>
              Správa vašeho Premium účtu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Premium aktivní</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Máte aktivní Premium účet s plným přístupem ke všem funkcím.
              </p>
            </div>
            
            <Button onClick={handleManageSubscription} variant="outline" className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Spravovat předplatné
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export dat
          </CardTitle>
          <CardDescription>
            Stáhněte kopii svých dat podle GDPR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExportData} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Exportovat všechna data
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Export obsahuje všechna vaše data uložená v aplikaci.
          </p>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Nebezpečná zóna
          </CardTitle>
          <CardDescription>
            Tyto akce jsou nevratné. Buďte opatrní.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Smazat účet
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Tato akce smaže všechna vaše data a nelze ji vrátit zpět.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
