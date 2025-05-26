
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { Helmet } from "react-helmet";
import { useAuth } from '@/hooks/useAuth';
import { Plus, Car } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import VehicleForm from '@/components/vehicle/VehicleForm';
import VehicleSelector from '@/components/vehicle/VehicleSelector';
import FuelConsumptionCard from '@/components/vehicle/FuelConsumptionCard';
import ServiceRecordCard from '@/components/vehicle/ServiceRecordCard';
import InsuranceCard from '@/components/vehicle/InsuranceCard';
import DocumentsCard from '@/components/vehicle/DocumentsCard';
import CrossBorderCard from '@/components/vehicle/CrossBorderCard';
import EmptyVehicleState from '@/components/vehicle/EmptyVehicleState';

const Vehicle = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useStandardizedToast();

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
      
      // Select the first vehicle by default if any exist
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

  // Find the currently selected vehicle object
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  return (
    <div className="container py-6 max-w-7xl">
      <Helmet>
        <title>Vozidlo | Pendlerův Pomocník</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vozidlo</h1>
          <p className="text-muted-foreground">
            Správa vašich vozidel, spotřeby a dokumentů
          </p>
        </div>
        
        <Button onClick={() => setIsAddSheetOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Přidat vozidlo
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <EmptyVehicleState onAddVehicle={() => setIsAddSheetOpen(true)} />
      ) : (
        <>
          <div className="mb-6">
            <VehicleSelector
              vehicles={vehicles}
              selectedVehicleId={selectedVehicleId}
              onSelect={setSelectedVehicleId}
            />
          </div>
          
          {selectedVehicle && (
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Přehled</TabsTrigger>
                <TabsTrigger value="fuel">Spotřeba</TabsTrigger>
                <TabsTrigger value="service">Servis</TabsTrigger>
                <TabsTrigger value="documents">Dokumenty</TabsTrigger>
                <TabsTrigger value="crossborder">Přeshraniční</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <FuelConsumptionCard vehicleId={selectedVehicleId} />
                    <ServiceRecordCard vehicleId={selectedVehicleId} />
                  </div>
                  <div className="space-y-6">
                    <InsuranceCard vehicleId={selectedVehicleId} />
                    <DocumentsCard vehicleId={selectedVehicleId} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="fuel">
                <FuelConsumptionCard vehicleId={selectedVehicleId} fullView />
              </TabsContent>
              
              <TabsContent value="service">
                <ServiceRecordCard vehicleId={selectedVehicleId} fullView />
              </TabsContent>
              
              <TabsContent value="documents">
                <DocumentsCard vehicleId={selectedVehicleId} fullView />
              </TabsContent>
              
              <TabsContent value="crossborder">
                <CrossBorderCard vehicleId={selectedVehicleId} />
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
      
      {/* Sheet for adding new vehicle */}
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
  );
};

export default Vehicle;
