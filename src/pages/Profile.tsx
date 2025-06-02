
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { User, Crown, Settings, Activity, Shield } from "lucide-react";
import ProfileNavigation from "@/components/profile/ProfileNavigation";
import { useState } from "react";

const Profile = () => {
  const { user, isPremium, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Pro zobrazení profilu se musíte přihlásit.</p>
            <Button onClick={() => navigate('/login')}>
              Přihlásit se
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Základní informace
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.email}</h3>
              <p className="text-sm text-muted-foreground">
                Registrován: {new Date(user.created_at || '').toLocaleDateString('cs-CZ')}
              </p>
              <div className="flex gap-2 mt-2">
                {isPremium && (
                  <Badge className="bg-amber-500">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {isAdmin && (
                  <Badge className="bg-red-500">
                    <Shield className="h-3 w-3 mr-1" />
                    Administrátor
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rychlé akce</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Nastavení účtu
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard')}>
            <Activity className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          {!isPremium && (
            <Button className="w-full justify-start" onClick={() => navigate('/premium')}>
              <Crown className="h-4 w-4 mr-2" />
              Upgradovat na Premium
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const SubscriptionTab = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Předplatné
        </CardTitle>
        <CardDescription>
          Správa vašeho Premium účtu
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPremium ? (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Premium Active</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Máte aktivní Premium účet s plným přístupem ke všem funkcím.
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/settings')}>
              Spravovat předplatné
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Nemáte aktivní Premium předplatné. Upgradujte pro přístup ke všem funkcím.
            </p>
            <Button onClick={() => navigate('/premium')}>
              <Crown className="h-4 w-4 mr-2" />
              Aktivovat Premium
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const ActivityTab = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Aktivita a statistiky
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Zde budou zobrazeny vaše statistiky použití aplikace.
        </p>
      </CardContent>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'subscription': return <SubscriptionTab />;
      case 'activity': return <ActivityTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Můj profil</h1>
        <p className="text-muted-foreground">
          Spravujte své informace a nastavení účtu
        </p>
      </div>

      <ProfileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="mt-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile;
