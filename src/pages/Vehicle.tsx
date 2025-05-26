
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { Helmet } from "react-helmet";
import { useAuth } from '@/hooks/useAuth';
import { Plus, Car, Gauge, Wrench, FileText, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import PremiumCheck from '@/components/premium/PremiumCheck';
import VehicleForm from '@/components/vehicle/VehicleForm';
import VehicleSelector from '@/components/vehicle/VehicleSelector';
import FuelConsumptionCard from '@/components/vehicle/FuelConsumptionCard';
import ServiceRecordCard from '@/components/vehicle/ServiceRecordCard';
import InsuranceCard from '@/components/vehicle/InsuranceCard';
import DocumentsCard from '@/components/vehicle/DocumentsCard';
import CrossBorderCard from '@/components/vehicle/CrossBorderCard';
import EmptyVehicleState from '@/components/vehicle/EmptyVehicleState';
import { UniversalMobileNavigation } from '@/components/navigation/UniversalMobileNavigation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import ResponsivePage from '@/components/layouts/ResponsivePage';

const Vehicle = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { success, error } = useStandardizedToast();
  const { isMobile, isSmallLandscape } = useScreenOrientation();

  // Memoized vehicle tabs for better performance
  const vehicleTabs = useMemo(() => [
    {
      id: "overview",
      label: "Přehled",
      icon: Car,
      description: "Hlavní přehled vozidla"
    },
    {
      id: "fuel",
      label: "Spotřeba",
      icon: Gauge,
      description: "Sledování spotřeby paliva"
    },
    {
      id: "service",
      label: "Servis",
      icon: Wrench,
      description: "Záznamy o servisu"
    },
    {
      id: "documents",
      label: "Dokumenty",
      icon: FileText,
      description: "Dokumenty vozidla"
    },
    {
      id: "crossborder",
      label: "Přeshraniční",
      icon: MapPin,
      description: "Přeshraniční jízdy"
    }
  ], []);

  useEffect(() => {
    if (user) {
      fetchVehicles();
    }
  }, [user]);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setVehicles(data || []);
      
      if (data && data.length > 0 && !selectedVehicleId) {
        setSelectedVehicleId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = async (formData) => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      const { data, error: insertError } = await supabase
        .from('vehicles')
        .insert([{ ...formData, user_id: user.id }])
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      setVehicles([data, ...vehicles]);
      setSelectedVehicleId(data.id);
      setIsAddSheetOpen(false);
      success("Vozidlo bylo úspěšně přidáno");
      
    } catch (err) {
      console.error("Error adding vehicle:", err);
      error("Chyba při přidání vozidla");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedVehicle = useMemo(() => 
    vehicles.find(v => v.id === selectedVehicleId), 
    [vehicles, selectedVehicleId]
  );

  const renderTabContent = () => {
    if (!selectedVehicle) return null;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4 md:space-y-6">
                <FuelConsumptionCard vehicleId={selectedVehicleId} />
                <ServiceRecordCard vehicleId={selectedVehicleId} />
              </div>
              <div className="space-y-4 md:space-y-6">
                <InsuranceCard vehicleId={selectedVehicleId} />
                <DocumentsCard vehicleId={selectedVehicleId} />
              </div>
            </div>
          </div>
        );
      case "fuel":
        return <FuelConsumptionCard vehicleId={selectedVehicleId} fullView />;
      case "service":
        return <ServiceRecordCard vehicleId={selectedVehicleId} fullView />;
      case "documents":
        return <DocumentsCard vehicleId={selectedVehicleId} fullView />;
      case "crossborder":
        return <CrossBorderCard vehicleId={selectedVehicleId} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <ResponsivePage>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ResponsivePage>
    );
  }

  return (
    <PremiumCheck featureKey="vehicle_management">
      <ResponsivePage enableMobileSafeArea>
        <div className="container max-w-7xl mx-auto">
          <Helmet>
            <title>Vozidlo | Pendlerův Pomocník</title>
          </Helmet>
          
          <div className={cn(
            "flex justify-between items-center mb-4 md:mb-6",
            isSmallLandscape && "mb-2"
          )}>
            <div>
              <h1 className={cn(
                "font-bold tracking-tight",
                isMobile ? "text-xl md:text-2xl" : "text-3xl"
              )}>
                Vozidlo
              </h1>
              <p className={cn(
                "text-muted-foreground",
                isMobile ? "text-sm" : "text-base"
              )}>
                Správa vašich vozidel, spotřeby a dokumentů
              </p>
            </div>
            
            <Button 
              onClick={() => setIsAddSheetOpen(true)} 
              className={cn(
                "flex items-center gap-2",
                isMobile ? "text-sm px-3 py-2" : ""
              )}
            >
              <Plus className="h-4 w-4" />
              {isMobile ? 'Přidat' : 'Přidat vozidlo'}
            </Button>
          </div>
          
          {vehicles.length === 0 ? (
            <EmptyVehicleState onAddVehicle={() => setIsAddSheetOpen(true)} />
          ) : (
            <>
              <div className="mb-4 md:mb-6">
                <VehicleSelector
                  vehicles={vehicles}
                  selectedVehicleId={selectedVehicleId}
                  onSelect={setSelectedVehicleId}
                />
              </div>
              
              {selectedVehicle && (
                <>
                  <UniversalMobileNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={vehicleTabs}
                    className="mb-4 md:mb-6"
                  />
                  
                  <div className="space-y-4 md:space-y-6">
                    {renderTabContent()}
                  </div>
                </>
              )}
            </>
          )}
          
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Přidat nové vozidlo
                </SheetTitle>
                <SheetDescription>
                  Vyplňte údaje o vašem vozidle. Všechna pole označená * jsou povinná.
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6">
                <VehicleForm
                  onSubmit={handleAddVehicle}
                  onCancel={() => setIsAddSheetOpen(false)}
                  isLoading={isSaving}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </ResponsivePage>
    </PremiumCheck>
  );
};

export default Vehicle;
