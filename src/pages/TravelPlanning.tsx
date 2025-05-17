
import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Calculator, Map, Users, Clock, CalendarClock } from "lucide-react";
import PremiumCheck from "@/components/premium/PremiumCheck";
import CommuteOptimizer from "@/components/travel/CommuteOptimizer";
import RideSharing from "@/components/travel/RideSharing";
import CommuteCostCalculator from "@/components/travel/CommuteCostCalculator";
import TrafficPredictions from "@/components/travel/TrafficPredictions";

const TravelPlanning = () => {
  const [activeTab, setActiveTab] = useState("optimizer");

  return (
    <PremiumCheck featureKey="travel_planning">
      <div className="container py-8">
        <Helmet>
          <title>Plánování cest | Pendler Buddy</title>
        </Helmet>
        
        {/* Header section */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Map className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Personalizované plánování cest</h1>
          </div>
          
          <p className="text-muted-foreground text-lg max-w-3xl">
            Optimalizujte své každodenní dojíždění, ušetřete náklady a čas s našimi nástroji pro plánování cest.
            Přizpůsobte své cesty podle vašich směn a sdílejte jízdy s ostatními pendlery.
          </p>
        </section>
        
        {/* Main content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full justify-start max-w-3xl">
            <TabsTrigger value="optimizer" className="flex items-center gap-2">
              <Car className="h-4 w-4" /> Optimalizace dojíždění
            </TabsTrigger>
            <TabsTrigger value="ridesharing" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Sdílení jízd
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" /> Kalkulačka nákladů
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Predikce dopravy
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="optimizer">
            <CommuteOptimizer />
          </TabsContent>
          
          <TabsContent value="ridesharing">
            <RideSharing />
          </TabsContent>
          
          <TabsContent value="calculator">
            <CommuteCostCalculator />
          </TabsContent>
          
          <TabsContent value="predictions">
            <TrafficPredictions />
          </TabsContent>
        </Tabs>
      </div>
    </PremiumCheck>
  );
};

export default TravelPlanning;
