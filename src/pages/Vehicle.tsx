
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSignIcon, GaugeCircleIcon, FileTextIcon, ShieldCheckIcon, WrenchIcon } from "lucide-react";
import ServiceRecordCard from "@/components/vehicle/ServiceRecordCard";
import DocumentsCard from "@/components/vehicle/DocumentsCard";
import InsuranceCard from "@/components/vehicle/InsuranceCard";
import FuelConsumptionCard from "@/components/vehicle/FuelConsumptionCard";

const Vehicle = () => {
  const { user } = useAuth();
  const [vehicleData, setVehicleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ukázková data pro vozidlo
  const demoVehicleData = {
    basic: {
      brand: "Škoda",
      model: "Octavia",
      year: "2019",
      licensePlate: "5A2 3456",
      vin: "TMB3G7NE0K0123456",
      fuelType: "Diesel",
      color: "Modrá",
      mileage: "78500"
    },
    technical: {
      engine: "2.0 TDI",
      power: "110 kW",
      transmission: "DSG",
      nextInspection: "06/2025",
      lastService: "02/2023",
      averageConsumption: "5.8 l/100km"
    },
    financial: {
      purchasePrice: "450 000 Kč",
      insuranceMonthly: "1 250 Kč",
      taxYearly: "3 600 Kč",
      lastRepairCost: "8 700 Kč"
    }
  };

  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Zde by byl skutečný požadavek na databázi pro získání dat o vozidle
        // Pro ukázku použijeme demoVehicleData
        // Simulujeme načítání dat
        setTimeout(() => {
          setVehicleData(demoVehicleData);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Chyba při načítání dat o vozidle:", error);
        setIsLoading(false);
      }
    };

    fetchVehicleData();
  }, [user]);

  return (
    <PremiumCheck featureKey="vehicle_management">
      <div className="container py-6">
        <Helmet>
          <title>Správa vozidla | Pendler Buddy</title>
        </Helmet>
        <h1 className="text-3xl font-bold mb-6">Správa vozidla</h1>
        <div className="mb-6">
          <p className="text-muted-foreground">
            Správa všech údajů o vašem vozidle, náklady na údržbu, historie oprav, spotřeba paliva a další.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Přehled</TabsTrigger>
              <TabsTrigger value="documents">Dokumenty</TabsTrigger>
              <TabsTrigger value="maintenance">Údržba</TabsTrigger>
              <TabsTrigger value="fuel">Spotřeba</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Základní informace</CardTitle>
                    <CardDescription>Obecné údaje o vašem vozidle</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Značka:</div>
                        <div className="font-medium">{demoVehicleData.basic.brand}</div>
                        
                        <div className="text-muted-foreground">Model:</div>
                        <div className="font-medium">{demoVehicleData.basic.model}</div>
                        
                        <div className="text-muted-foreground">Rok výroby:</div>
                        <div className="font-medium">{demoVehicleData.basic.year}</div>
                        
                        <div className="text-muted-foreground">SPZ:</div>
                        <div className="font-medium">{demoVehicleData.basic.licensePlate}</div>
                        
                        <div className="text-muted-foreground">VIN:</div>
                        <div className="font-medium">{demoVehicleData.basic.vin}</div>
                        
                        <div className="text-muted-foreground">Typ paliva:</div>
                        <div className="font-medium">{demoVehicleData.basic.fuelType}</div>
                        
                        <div className="text-muted-foreground">Barva:</div>
                        <div className="font-medium">{demoVehicleData.basic.color}</div>
                        
                        <div className="text-muted-foreground">Kilometráž:</div>
                        <div className="font-medium">{demoVehicleData.basic.mileage} km</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <InsuranceCard />
              </div>
              
              <FuelConsumptionCard />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentsCard />
            </TabsContent>
            
            <TabsContent value="maintenance">
              <ServiceRecordCard />
            </TabsContent>
            
            <TabsContent value="fuel">
              <FuelConsumptionCard />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PremiumCheck>
  );
};

export default Vehicle;
