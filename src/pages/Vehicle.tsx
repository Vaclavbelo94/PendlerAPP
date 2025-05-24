import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Edit } from "lucide-react";
import ServiceRecordCard from "@/components/vehicle/ServiceRecordCard";
import DocumentsCard from "@/components/vehicle/DocumentsCard";
import InsuranceCard from "@/components/vehicle/InsuranceCard";
import FuelConsumptionCard from "@/components/vehicle/FuelConsumptionCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VehicleData } from "@/types/vehicle";
import { fetchVehicles, fetchVehicleById, saveVehicle } from "@/services/vehicleService";
import { toast } from "sonner";
import VehicleForm from "@/components/vehicle/VehicleForm";
import VehicleSelector from "@/components/vehicle/VehicleSelector";
import { useIsMobile } from '@/hooks/use-mobile';
import { SectionHeader } from "@/components/ui/section-header";
import { FlexContainer } from "@/components/ui/flex-container";

const Vehicle = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewVehicleDialogOpen, setIsNewVehicleDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadVehicles = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const vehiclesData = await fetchVehicles(user.id);
        setVehicles(vehiclesData);
        
        // Pokud existují vozidla, načteme první
        if (vehiclesData.length > 0) {
          setSelectedVehicleId(vehiclesData[0].id);
          loadVehicleDetails(vehiclesData[0].id!);
        } else {
          setIsLoading(false);
          // Pokud uživatel nemá žádná vozidla, zobrazíme dialog pro přidání
          setIsNewVehicleDialogOpen(true);
        }
      } catch (error) {
        console.error("Chyba při načítání vozidel:", error);
        setIsLoading(false);
      }
    };

    loadVehicles();
  }, [user]);

  const loadVehicleDetails = async (vehicleId: string) => {
    if (!vehicleId) return;
    
    setIsLoading(true);
    try {
      const data = await fetchVehicleById(vehicleId);
      if (data) {
        setVehicleData(data);
      }
    } catch (error) {
      console.error("Chyba při načítání dat o vozidle:", error);
      toast.error("Nepodařilo se načíst detaily vozidla");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedVehicleId) {
      loadVehicleDetails(selectedVehicleId);
    }
  }, [selectedVehicleId]);

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
  };

  const handleSaveVehicle = async (vehicle: VehicleData) => {
    try {
      if (!user) {
        toast.error("Pro uložení vozidla je nutné být přihlášen");
        return;
      }
      
      const updatedVehicle = await saveVehicle({
        ...vehicle,
        user_id: user.id
      });
      
      if (updatedVehicle) {
        // Pokud je to úprava existujícího vozidla
        if (vehicle.id) {
          setVehicleData(updatedVehicle);
          setVehicles(prev => prev.map(v => v.id === vehicle.id ? updatedVehicle : v));
          setIsEditDialogOpen(false);
        } 
        // Pokud je to nové vozidlo
        else {
          setVehicles(prev => [...prev, updatedVehicle]);
          setSelectedVehicleId(updatedVehicle.id);
          setVehicleData(updatedVehicle);
          setIsNewVehicleDialogOpen(false);
        }
      }
    } catch (error) {
      console.error("Chyba při ukládání vozidla:", error);
      toast.error("Nepodařilo se uložit vozidlo");
    }
  };

  const getDialogMaxHeight = () => {
    return isMobile ? "max-h-[90vh] overflow-hidden" : "";
  };

  return (
    <PremiumCheck featureKey="vehicle_management">
      <div className="container py-6">
        <Helmet>
          <title>Správa vozidla | Pendler Buddy</title>
        </Helmet>
        
        <SectionHeader 
          title="Správa vozidla"
          description="Správa všech údajů o vašem vozidle, náklady na údržbu, historie oprav, spotřeba paliva a další."
          action={{
            label: "Přidat vozidlo",
            onClick: () => setIsNewVehicleDialogOpen(true),
            icon: <PlusCircle className="h-4 w-4" />
          }}
        />

        {vehicles.length > 0 && (
          <div className="mb-6">
            <VehicleSelector 
              vehicles={vehicles} 
              selectedVehicleId={selectedVehicleId} 
              onSelect={handleVehicleSelect} 
            />
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : !vehicleData ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-muted-foreground mb-4">
                Nemáte přidané žádné vozidlo. Klikněte na tlačítko "Přidat vozidlo" výše.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <FlexContainer justify="end" className="mb-4">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(true)}
                size={isMobile ? "sm" : "default"}
                className="min-h-[44px]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Upravit údaje o vozidle
              </Button>
            </FlexContainer>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className={cn("mb-6", isMobile ? "grid grid-cols-2 w-full" : "")}>
                <TabsTrigger value="overview" className={isMobile ? "text-xs" : ""}>Přehled</TabsTrigger>
                <TabsTrigger value="documents" className={isMobile ? "text-xs" : ""}>Dokumenty</TabsTrigger>
                <TabsTrigger value="maintenance" className={isMobile ? "text-xs" : ""}>Údržba</TabsTrigger>
                <TabsTrigger value="fuel" className={isMobile ? "text-xs" : ""}>Spotřeba</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2")}>
                  <Card>
                    <div className={cn("p-6", isMobile ? "p-4" : "")}>
                      <h3 className={cn("font-semibold mb-4", isMobile ? "text-base" : "text-lg")}>
                        Základní informace
                      </h3>
                      <p className={cn("text-muted-foreground mb-4", isMobile ? "text-xs" : "text-sm")}>
                        Obecné údaje o vašem vozidle
                      </p>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>Značka:</div>
                          <div className={cn("font-medium", isMobile ? "text-sm" : "text-base")}>{vehicleData.brand}</div>
                          
                          <div className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>Model:</div>
                          <div className={cn("font-medium", isMobile ? "text-sm" : "text-base")}>{vehicleData.model}</div>
                          
                          <div className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>Rok výroby:</div>
                          <div className={cn("font-medium", isMobile ? "text-sm" : "text-base")}>{vehicleData.year}</div>
                          
                          <div className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>SPZ:</div>
                          <div className={cn("font-medium", isMobile ? "text-sm" : "text-base")}>{vehicleData.license_plate}</div>
                          
                          <div className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>VIN:</div>
                          <div className={cn("font-medium", isMobile ? "text-sm" : "text-base")}>{vehicleData.vin}</div>
                          
                          <div className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>Typ paliva:</div>
                          <div className={cn("font-medium", isMobile ? "text-sm" : "text-base")}>{vehicleData.fuel_type}</div>
                          
                          <div className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>Barva:</div>
                          <div className={cn("font-medium", isMobile ? "text-sm" : "text-base")}>{vehicleData.color}</div>
                          
                          <div className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>Kilometráž:</div>
                          <div className={cn("font-medium", isMobile ? "text-sm" : "text-base")}>{vehicleData.mileage} km</div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <InsuranceCard vehicleId={vehicleData.id!} />
                </div>
                
                <FuelConsumptionCard vehicleId={vehicleData.id!} />
              </TabsContent>

              <TabsContent value="documents">
                <DocumentsCard vehicleId={vehicleData.id!} />
              </TabsContent>
              
              <TabsContent value="maintenance">
                <ServiceRecordCard vehicleId={vehicleData.id!} />
              </TabsContent>
              
              <TabsContent value="fuel">
                <FuelConsumptionCard vehicleId={vehicleData.id!} detailed />
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Dialog pro úpravu vozidla */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className={`sm:max-w-[600px] ${getDialogMaxHeight()}`}>
            <DialogHeader>
              <DialogTitle>Upravit vozidlo</DialogTitle>
              <DialogDescription>
                Upravte údaje o svém vozidle.
              </DialogDescription>
            </DialogHeader>
            {vehicleData && <VehicleForm initialData={vehicleData} onSave={handleSaveVehicle} />}
          </DialogContent>
        </Dialog>

        {/* Dialog pro přidání nového vozidla */}
        <Dialog open={isNewVehicleDialogOpen} onOpenChange={setIsNewVehicleDialogOpen}>
          <DialogContent className={`sm:max-w-[600px] ${getDialogMaxHeight()}`}>
            <DialogHeader>
              <DialogTitle>Přidat nové vozidlo</DialogTitle>
              <DialogDescription>
                Zadejte údaje o svém vozidle.
              </DialogDescription>
            </DialogHeader>
            <VehicleForm onSave={handleSaveVehicle} />
          </DialogContent>
        </Dialog>
      </div>
    </PremiumCheck>
  );
};

export default Vehicle;
