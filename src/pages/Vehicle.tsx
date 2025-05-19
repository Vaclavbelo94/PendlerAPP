
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSignIcon, GaugeCircleIcon, FileTextIcon, ShieldCheckIcon, WrenchIcon } from "lucide-react";

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
              <TabsTrigger value="technical">Technické údaje</TabsTrigger>
              <TabsTrigger value="financial">Finance</TabsTrigger>
              <TabsTrigger value="history">Historie</TabsTrigger>
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

                <Card>
                  <CardHeader>
                    <CardTitle>Náklady a finance</CardTitle>
                    <CardDescription>Finanční přehled vašeho vozidla</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-between items-center py-2 border-b">
                          <div className="flex items-center gap-2">
                            <CircleDollarSignIcon className="text-primary h-5 w-5" />
                            <span>Pořizovací cena</span>
                          </div>
                          <div className="font-medium">{demoVehicleData.financial.purchasePrice}</div>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b">
                          <div className="flex items-center gap-2">
                            <ShieldCheckIcon className="text-primary h-5 w-5" />
                            <span>Měsíční pojištění</span>
                          </div>
                          <div className="font-medium">{demoVehicleData.financial.insuranceMonthly}</div>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b">
                          <div className="flex items-center gap-2">
                            <GaugeCircleIcon className="text-primary h-5 w-5" />
                            <span>Průměrná spotřeba</span>
                          </div>
                          <div className="font-medium">{demoVehicleData.technical.averageConsumption}</div>
                        </div>
                        
                        <div className="flex justify-between items-center py-2">
                          <div className="flex items-center gap-2">
                            <WrenchIcon className="text-primary h-5 w-5" />
                            <span>Poslední servis</span>
                          </div>
                          <div className="font-medium">{demoVehicleData.technical.lastService}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Nadcházející údržba</CardTitle>
                  <CardDescription>Termíny důležitých servisních úkonů</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">STK</div>
                        <div className="text-sm text-muted-foreground">Technická kontrola</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{demoVehicleData.technical.nextInspection}</div>
                        <div className="text-sm text-muted-foreground">Za 123 dní</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">Výměna oleje</div>
                        <div className="text-sm text-muted-foreground">Pravidelný servis</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">08/2023</div>
                        <div className="text-sm text-muted-foreground">Za 45 dní</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="technical">
              <Card>
                <CardHeader>
                  <CardTitle>Technické údaje</CardTitle>
                  <CardDescription>Detailní technické informace o vašem vozidle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Motor:</div>
                        <div className="font-medium">{demoVehicleData.technical.engine}</div>
                        
                        <div className="text-muted-foreground">Výkon:</div>
                        <div className="font-medium">{demoVehicleData.technical.power}</div>
                        
                        <div className="text-muted-foreground">Převodovka:</div>
                        <div className="font-medium">{demoVehicleData.technical.transmission}</div>
                        
                        <div className="text-muted-foreground">Další STK:</div>
                        <div className="font-medium">{demoVehicleData.technical.nextInspection}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Poslední servis:</div>
                        <div className="font-medium">{demoVehicleData.technical.lastService}</div>
                        
                        <div className="text-muted-foreground">Prům. spotřeba:</div>
                        <div className="font-medium">{demoVehicleData.technical.averageConsumption}</div>
                        
                        <div className="text-muted-foreground">Typ paliva:</div>
                        <div className="font-medium">{demoVehicleData.basic.fuelType}</div>
                        
                        <div className="text-muted-foreground">Kilometráž:</div>
                        <div className="font-medium">{demoVehicleData.basic.mileage} km</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="financial">
              <Card>
                <CardHeader>
                  <CardTitle>Finanční přehled</CardTitle>
                  <CardDescription>Správa finančních aspektů vašeho vozidla</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="shadow-none border">
                        <CardHeader className="px-4 py-3">
                          <CardTitle className="text-base">Pravidelné náklady</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-3 pt-0">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Pojištění (měsíčně)</span>
                              <span className="font-medium">{demoVehicleData.financial.insuranceMonthly}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Daň (ročně)</span>
                              <span className="font-medium">{demoVehicleData.financial.taxYearly}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Palivo (měsíčně)</span>
                              <span className="font-medium">5 800 Kč</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="shadow-none border">
                        <CardHeader className="px-4 py-3">
                          <CardTitle className="text-base">Jednorázové výdaje</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-3 pt-0">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Poslední oprava</span>
                              <span className="font-medium">{demoVehicleData.financial.lastRepairCost}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Poslední STK</span>
                              <span className="font-medium">1 800 Kč</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Poslední servis</span>
                              <span className="font-medium">5 300 Kč</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card className="shadow-none border">
                      <CardHeader className="px-4 py-3">
                        <CardTitle className="text-base">Celkové náklady</CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-3 pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Pořízení vozidla</span>
                            <span className="font-medium">{demoVehicleData.financial.purchasePrice}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Celkové náklady (bez pohonných hmot)</span>
                            <span className="font-medium">89 700 Kč</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Celkové náklady na pohonné hmoty</span>
                            <span className="font-medium">127 500 Kč</span>
                          </div>
                          <div className="flex justify-between items-center font-medium pt-2 border-t">
                            <span>Celkem za vozidlo</span>
                            <span>667 200 Kč</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Historie vozidla</CardTitle>
                  <CardDescription>Chronologický přehled událostí vašeho vozidla</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative border-l border-border pl-6">
                      <div className="mb-8">
                        <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-primary"></div>
                        <h3 className="font-medium">Výměna oleje a filtrů</h3>
                        <p className="text-sm text-muted-foreground">24. únor 2023</p>
                        <p className="mt-2">Pravidelný servis - výměna motorového oleje, olejového filtru, vzduchového filtru. Kontrola brzdové kapaliny.</p>
                        <p className="mt-1 text-sm text-muted-foreground">Cena: 5 300 Kč</p>
                      </div>
                      
                      <div className="mb-8">
                        <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-primary"></div>
                        <h3 className="font-medium">Výměna brzdových destiček</h3>
                        <p className="text-sm text-muted-foreground">15. leden 2023</p>
                        <p className="mt-2">Výměna předních brzdových destiček z důvodu opotřebení. Kontrola brzdových kotoučů.</p>
                        <p className="mt-1 text-sm text-muted-foreground">Cena: 3 400 Kč</p>
                      </div>
                      
                      <div className="mb-8">
                        <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-primary"></div>
                        <h3 className="font-medium">STK + Emise</h3>
                        <p className="text-sm text-muted-foreground">2. prosinec 2022</p>
                        <p className="mt-2">Pravidelná technická kontrola a měření emisí. Bez závad.</p>
                        <p className="mt-1 text-sm text-muted-foreground">Cena: 1 800 Kč</p>
                      </div>
                      
                      <div>
                        <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-primary"></div>
                        <h3 className="font-medium">Nákup vozidla</h3>
                        <p className="text-sm text-muted-foreground">15. červen 2019</p>
                        <p className="mt-2">Pořízení vozidla Škoda Octavia, 2.0 TDI, najeto 12 500 km.</p>
                        <p className="mt-1 text-sm text-muted-foreground">Cena: 450 000 Kč</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PremiumCheck>
  );
};

export default Vehicle;
