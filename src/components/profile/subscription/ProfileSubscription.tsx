
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Crown, Star, Check, ArrowRight } from "lucide-react";

const ProfileSubscription = () => {
  const { isPremium } = useAuth();
  const navigate = useNavigate();

  const premiumFeatures = [
    'Bez reklam v celé aplikaci',
    'Přístup ke všem jazykovým lekcím',
    'Pokročilé statistiky a analýzy',
    'Neomezená synchronizace',
    'Prioritní podpora',
    'Export dat a reportů',
    'Offline režim pro všechny funkce'
  ];

  if (isPremium) {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <Crown className="h-5 w-5" />
            Premium účet aktivní
          </CardTitle>
          <CardDescription>
            Užíváte si všechny Premium výhody naší aplikace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500 text-white">
              <Star className="h-3 w-3 mr-1" />
              Premium
            </Badge>
            <span className="text-sm text-muted-foreground">Aktivní předplatné</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => navigate('/premium')}
              className="w-full"
            >
              Spravovat předplatné
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Upgrade na Premium
        </CardTitle>
        <CardDescription>
          Odemkněte všechny funkce a využijte plný potenciál aplikace
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <Crown className="h-12 w-12 mx-auto mb-3 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Staňte se Premium uživatelem</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Získejte přístup ke všem funkcím bez omezení
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Premium výhody:</h4>
          <div className="grid grid-cols-1 gap-2">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button 
            onClick={() => navigate('/premium')}
            className="w-full"
            size="lg"
          >
            <Crown className="h-4 w-4 mr-2" />
            Aktivovat Premium
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSubscription;
