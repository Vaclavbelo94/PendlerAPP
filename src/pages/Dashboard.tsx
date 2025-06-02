
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, TrendingUp, Clock, BookOpen, Calculator } from "lucide-react";
import { AdBanner } from "@/components/ads/AdBanner";
import { useAds } from "@/components/ads/AdProvider";

const Dashboard = () => {
  const { user, isPremium } = useAuth();
  const { shouldShowAds } = useAds();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleQuickAction = (route: string) => {
    navigate(route);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Ad Banner pro non-premium uživatele */}
      {shouldShowAds && (
        <AdBanner className="mb-6" />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Vítejte zpět, {user.email?.split('@')[0]}!
          </p>
        </div>
        {isPremium && (
          <Badge className="bg-amber-500">
            <Crown className="h-4 w-4 mr-1" />
            Premium
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tento měsíc</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€2,450</div>
            <p className="text-xs text-muted-foreground">
              +12% od minulého měsíce
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Směny</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              v tomto měsíci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Naučená slova</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              +8 tento týden
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Úspory</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€324</div>
            <p className="text-xs text-muted-foreground">
              optimalizované cesty
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rychlé akce</CardTitle>
            <CardDescription>
              Nejčastěji používané funkce
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleQuickAction('/shifts')}
              >
                <Clock className="h-6 w-6" />
                <span>Přidat směnu</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleQuickAction('/calculator')}
              >
                <Calculator className="h-6 w-6" />
                <span>Kalkulačka</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleQuickAction('/language')}
              >
                <BookOpen className="h-6 w-6" />
                <span>Němčina</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => {/* Stay on dashboard - just scroll to stats */}}
              >
                <TrendingUp className="h-6 w-6" />
                <span>Statistiky</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {!isPremium && (
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  Přejít na Premium
                </CardTitle>
                <CardDescription>
                  Odemkněte všechny funkce a odstraňte reklamy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🚫</span>
                      <span className="text-xs">Bez reklam</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">📚</span>
                      <span className="text-xs">Všechny lekce</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">📊</span>
                      <span className="text-xs">Pokročilé statistiky</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    Upgradovat nyní
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sidebar Ad pro non-premium */}
          {shouldShowAds && (
            <AdBanner variant="square" showCloseButton />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
