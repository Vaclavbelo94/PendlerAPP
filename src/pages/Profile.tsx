
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { User, Crown, Settings, Activity, Shield, Eye } from "lucide-react";
import ProfileNavigation from "@/components/profile/ProfileNavigation";
import ProfileAppearance from "@/components/profile/ProfileAppearance";
import { useState } from "react";
import { PageContainer } from "@/components/layout/StandardContainers";
import { StandardCard } from "@/components/ui/StandardCard";
import { UnifiedGrid } from "@/components/layout/UnifiedGrid";
import { useIsMobile } from "@/hooks/use-mobile";

const Profile = () => {
  const { user, isPremium, isAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <PageContainer maxWidth="xl" padding="lg">
        <StandardCard>
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Pro zobrazení profilu se musíte přihlásit.</p>
            <Button onClick={() => navigate('/login')}>
              Přihlásit se
            </Button>
          </div>
        </StandardCard>
      </PageContainer>
    );
  }

  const OverviewTab = () => (
    <UnifiedGrid 
      columns={{ mobile: 1, desktop: 1 }} 
      gap="lg"
    >
      <StandardCard 
        title="Základní informace"
        fullHeight
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <Avatar className="h-16 w-16 mx-auto sm:mx-0">
            <AvatarFallback className="text-lg">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-2">{user.email}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Registrován: {new Date(user.created_at || '').toLocaleDateString('cs-CZ')}
            </p>
            <div className="flex gap-2 justify-center sm:justify-start">
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
      </StandardCard>

      <StandardCard title="Rychlé akce" fullHeight>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start h-auto py-3" 
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4 mr-3" />
            <span className="text-left">Nastavení účtu</span>
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start h-auto py-3" 
            onClick={() => navigate('/dashboard')}
          >
            <Activity className="h-4 w-4 mr-3" />
            <span className="text-left">Dashboard</span>
          </Button>
          {!isPremium && (
            <Button 
              className="w-full justify-start h-auto py-3" 
              onClick={() => navigate('/premium')}
            >
              <Crown className="h-4 w-4 mr-3" />
              <span className="text-left">Upgradovat na Premium</span>
            </Button>
          )}
        </div>
      </StandardCard>
    </UnifiedGrid>
  );

  const AppearanceTab = () => (
    <PageContainer maxWidth="xl" padding="sm">
      <StandardCard title="Nastavení vzhledu" description="Přizpůsobte si vzhled aplikace">
        <ProfileAppearance />
      </StandardCard>
    </PageContainer>
  );

  const SubscriptionTab = () => (
    <StandardCard 
      title="Předplatné" 
      description="Správa vašeho Premium účtu"
    >
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
    </StandardCard>
  );

  const ActivityTab = () => (
    <StandardCard 
      title="Aktivita a statistiky"
      description="Přehled vašeho používání aplikace"
    >
      <p className="text-muted-foreground">
        Zde budou zobrazeny vaše statistiky použití aplikace.
      </p>
    </StandardCard>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'appearance': return <AppearanceTab />;
      case 'subscription': return <SubscriptionTab />;
      case 'activity': return <ActivityTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <PageContainer maxWidth="xl" padding="lg">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold mb-2">Můj profil</h1>
        <p className="text-muted-foreground">
          Spravujte své informace a nastavení účtu
        </p>
      </div>

      <ProfileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="mt-8">
        {renderTabContent()}
      </div>
    </PageContainer>
  );
};

export default Profile;
