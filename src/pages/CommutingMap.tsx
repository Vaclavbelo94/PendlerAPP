
import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapIcon, Filter, Users, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import PremiumCheck from "@/components/premium/PremiumCheck";

import CommuterMap from '@/components/maps/CommuterMap';
import MapFilters from '@/components/maps/MapFilters';
import CommuterDirectories from '@/components/maps/CommuterDirectories';
import RegionalInfo from '@/components/maps/RegionalInfo';

const CommutingMap = () => {
  const [activeTab, setActiveTab] = useState("map");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleNavigateBack = () => {
    navigate(-1);
  };

  return (
    <PremiumCheck featureKey="commuting_map">
      <ResponsiveContainer className={`py-4 ${isMobile ? 'px-2' : 'py-8'}`}>
        <Helmet>
          <title>Mapa pendlerů | Pendlerův Pomocník</title>
        </Helmet>
        
        {/* Back button */}
        <Button 
          variant="outline" 
          onClick={handleNavigateBack} 
          className="mb-4"
        >
          Zpět
        </Button>
        
        {/* Header section */}
        <section className="mb-6">
          <div className={`flex items-center gap-3 mb-4 ${isMobile ? 'flex-col text-center' : ''}`}>
            <div className="p-2 rounded-full bg-primary/10">
              <MapIcon className="h-6 w-6 text-primary" />
            </div>
            <h1 className={`text-3xl font-bold ${isMobile ? 'text-2xl' : ''}`}>
              Interaktivní mapa pro pendlery
            </h1>
          </div>
          
          <p className="text-muted-foreground text-lg max-w-3xl">
            Prozkoumejte populární trasy, oblasti s vysokou koncentrací pendlerů a užitečné informace pro vaše každodenní cestování.
          </p>
        </section>
        
        {/* Main content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className={`${isMobile ? 'w-full flex overflow-x-auto' : 'w-full justify-start max-w-3xl overflow-x-auto'}`}>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapIcon className="h-4 w-4" /> {!isMobile ? "Interaktivní mapa" : "Mapa"}
            </TabsTrigger>
            <TabsTrigger value="filters" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> {!isMobile ? "Filtry a nastavení" : "Filtry"}
            </TabsTrigger>
            <TabsTrigger value="communities" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> {!isMobile ? "Adresář pendlerů" : "Adresář"}
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="h-4 w-4" /> {!isMobile ? "Regionální informace" : "Info"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Mapa pendlerů</CardTitle>
                <CardDescription>
                  Interaktivní mapa zobrazující trasy, oblasti a další užitečné informace pro pendlery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommuterMap />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="filters">
            <MapFilters />
          </TabsContent>
          
          <TabsContent value="communities">
            <CommuterDirectories />
          </TabsContent>
          
          <TabsContent value="info">
            <RegionalInfo />
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </PremiumCheck>
  );
};

export default CommutingMap;
