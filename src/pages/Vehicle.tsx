
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { Helmet } from "react-helmet";
import { useSimplifiedAuth } from '@/hooks/auth/useSimplifiedAuth';
import { Plus, Car } from 'lucide-react';
import OptimizedPremiumCheck from '@/components/premium/OptimizedPremiumCheck';
import ResponsivePage from '@/components/layouts/ResponsivePage';
import FastLoadingFallback from '@/components/common/FastLoadingFallback';
import { useVehicleManagement } from '@/hooks/vehicle/useVehicleManagement';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { VehicleData } from '@/types/vehicle';
import { PageContainer } from '@/components/layout/StandardContainers';
import { UnifiedGrid } from '@/components/layout/UnifiedGrid';

// Direct imports
import VehicleForm from '@/components/vehicle/VehicleForm';
import VehicleSelectorOptimized from '@/components/vehicle/VehicleSelectorOptimized';
import VehicleNavigation from '@/components/vehicle/VehicleNavigation';
import FuelConsumptionCard from '@/components/vehicle/FuelConsumptionCard';
import ServiceRecordCard from '@/components/vehicle/ServiceRecordCard';
import InsuranceCard from '@/components/vehicle/InsuranceCard';
import DocumentsCard from '@/components/vehicle/DocumentsCard';
import EmptyVehicleState from '@/components/vehicle/EmptyVehicleState';
import VehicleErrorBoundary from '@/components/vehicle/VehicleErrorBoundary';
import DeleteVehicleDialog from '@/components/vehicle/DeleteVehicleDialog';

const Vehicle = () => {
  const { user, isInitialized } = useSimplifiedAuth();
  const isMobile = useIsMobile();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleData | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<VehicleData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const {
    vehicles,
    selectedVehicle,
    selectedVehicleId,
    isLoading,
    isSaving,
    error,
    retryCount,
    addVehicle,
    updateVehicle,
    removeVehicle,
    selectVehicle,
    retryLastOperation
  } = useVehicleManagement(user?.id);

  const handleAddVehicle = async (formData: any) => {
    const newVehicle = await addVehicle(formData);
    if (newVehicle) {
      setIsAddSheetOpen(false);
    }
  };

  const handleEditVehicle = async (formData: any) => {
    if (!editingVehicle) return;
    
    const updatedVehicle = await updateVehicle({ ...formData, id: editingVehicle.id });
    if (updatedVehicle) {
      setIsEditSheetOpen(false);
      setEditingVehicle(null);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!deletingVehicle?.id) return;
    
    await removeVehicle(deletingVehicle.id);
    setIsDeleteDialogOpen(false);
    setDeletingVehicle(null);
  };

  const openEditDialog = (vehicle: VehicleData) => {
    setEditingVehicle(vehicle);
    setIsEditSheetOpen(true);
  };

  const openDeleteDialog = (vehicle: VehicleData) => {
    setDeletingVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const renderTabContent = () => {
    if (!selectedVehicle || !selectedVehicleId) return null;

    switch (activeTab) {
      case "overview":
        return (
          <UnifiedGrid 
            columns={{ mobile: 1, tablet: 1, desktop: 2 }} 
            gap="lg"
          >
            <FuelConsumptionCard vehicleId={selectedVehicleId} />
            <ServiceRecordCard vehicleId={selectedVehicleId} />
            <InsuranceCard vehicleId={selectedVehicleId} />
            <DocumentsCard vehicleId={selectedVehicleId} />
          </UnifiedGrid>
        );
      case "fuel":
        return <FuelConsumptionCard vehicleId={selectedVehicleId} fullView />;
      case "service":
        return <ServiceRecordCard vehicleId={selectedVehicleId} fullView />;
      case "documents":
        return <DocumentsCard vehicleId={selectedVehicleId} fullView />;
      default:
        return null;
    }
  };

  if (!isInitialized) {
    return (
      <OptimizedPremiumCheck featureKey="vehicle_management">
        <ResponsivePage>
          <FastLoadingFallback message="Inicializace..." />
        </ResponsivePage>
      </OptimizedPremiumCheck>
    );
  }

  if (error && !isLoading) {
    return (
      <OptimizedPremiumCheck featureKey="vehicle_management">
        <ResponsivePage enableMobileSafeArea>
          <PageContainer maxWidth="xl" padding="lg">
            <VehicleErrorBoundary 
              error={error} 
              onRetry={retryLastOperation}
              retryCount={retryCount}
            />
          </PageContainer>
        </ResponsivePage>
      </OptimizedPremiumCheck>
    );
  }

  if (isLoading) {
    return (
      <OptimizedPremiumCheck featureKey="vehicle_management">
        <ResponsivePage>
          <FastLoadingFallback message="Načítání vozidel..." />
        </ResponsivePage>
      </OptimizedPremiumCheck>
    );
  }

  return (
    <OptimizedPremiumCheck featureKey="vehicle_management">
      <ResponsivePage enableMobileSafeArea>
        <PageContainer maxWidth="xl" padding="lg">
          <Helmet>
            <title>Vozidlo | Pendlerův Pomocník</title>
          </Helmet>
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                Vozidlo
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Správa vašich vozidel, spotřeby a dokumentů
              </p>
            </div>
            
            <Button 
              onClick={() => setIsAddSheetOpen(true)} 
              className="w-full md:w-auto flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Přidat vozidlo
            </Button>
          </div>
          
          {vehicles.length === 0 ? (
            <EmptyVehicleState onAddVehicle={() => setIsAddSheetOpen(true)} />
          ) : (
            <>
              {/* Vehicle selector with actions */}
              <div className="mb-6">
                <VehicleSelectorOptimized
                  vehicles={vehicles}
                  selectedVehicleId={selectedVehicleId}
                  onSelect={selectVehicle}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                  className="w-full"
                />
              </div>
              
              {selectedVehicle && (
                <>
                  {/* Navigation */}
                  <div className="mb-6">
                    <VehicleNavigation
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="pb-6">
                    {renderTabContent()}
                  </div>
                </>
              )}
            </>
          )}
          
          {/* Add Vehicle Sheet */}
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetContent className="overflow-y-auto w-full sm:max-w-2xl">
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

          {/* Edit Vehicle Sheet */}
          <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
            <SheetContent className="overflow-y-auto w-full sm:max-w-2xl">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Upravit vozidlo
                </SheetTitle>
                <SheetDescription>
                  Upravte údaje o vašem vozidle.
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6">
                <VehicleForm
                  onSubmit={handleEditVehicle}
                  onCancel={() => {
                    setIsEditSheetOpen(false);
                    setEditingVehicle(null);
                  }}
                  isLoading={isSaving}
                  vehicle={editingVehicle || undefined}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Delete Vehicle Dialog */}
          <DeleteVehicleDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setDeletingVehicle(null);
            }}
            onConfirm={handleDeleteVehicle}
            vehicle={deletingVehicle}
            isLoading={isSaving}
          />
        </PageContainer>
      </ResponsivePage>
    </OptimizedPremiumCheck>
  );
};

export default Vehicle;
