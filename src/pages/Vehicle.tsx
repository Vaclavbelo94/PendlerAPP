
import React, { useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import VehicleForm from "@/components/vehicle/VehicleForm";
import VehicleSelector from "@/components/vehicle/VehicleSelector";
import { useIsMobile } from '@/hooks/use-mobile';
import { SectionHeader } from "@/components/ui/section-header";
import { FlexContainer } from "@/components/ui/flex-container";
import { cn } from "@/lib/utils";
import { useVehicleData } from "@/hooks/vehicle/useVehicleData";
import { useVehicleOperations } from "@/hooks/vehicle/useVehicleOperations";

const Vehicle = () => {
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewVehicleDialogOpen, setIsNewVehicleDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const {
    vehicles,
    setVehicles,
    selectedVehicleId,
    vehicleData,
    setVehicleData,
    isLoading,
    handleVehicleSelect
  } = useVehicleData(user);

  const { handleSaveVehicle } = useVehicleOperations(
    user,
    setVehicles,
    setVehicleData,
    (id: string) => handleVehicleSelect(id)
  );

  const onSaveVehicle = async (vehicle: any) => {
    const result = await handleSaveVehicle(vehicle);
    if (result) {
      if (vehicle.id) {
        setIsEditDialogOpen(false);
      } else {
        setIsNewVehicleDialogOpen(false);
      }
    }
  };

  const getDialogMaxHeight = () => {
    return isMobile ? "max-h-[90vh] overflow-hidden" : "";
  };

  if (isLoading) {
    return (
      <PremiumCheck featureKey="vehicle_management">
        <div className="container py-6">
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </PremiumCheck>
    );
  }

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

        {!vehicleData ? (
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
                <TabsTrigger value="overview" className={cn(isMobile ? "text-xs" : "")}>Přehled</TabsTrigger>
                <TabsTrigger value="documents" className={cn(isMobile ? "text-xs" : "")}>Dokumenty</TabsTrigger>
                <TabsTrigger value="maintenance" className={cn(isMobile ? "text-xs" : "")}>Údržba</TabsTrigger>
                <TabsTrigger value="fuel" className={cn(isMobile ? "text-xs" : "")}>Spotřeba</TabsTrigger>
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
            {vehicleData && <VehicleForm initialData={vehicleData} onSave={onSaveVehicle} />}
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
            <VehicleForm onSave={onSaveVehicle} />
          </DialogContent>
        </Dialog>
      </div>
    </PremiumCheck>
  );
};

export default Vehicle;
