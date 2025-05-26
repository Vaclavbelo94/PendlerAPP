
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { Helmet } from "react-helmet";
import { useSimplifiedAuth } from '@/hooks/auth/useSimplifiedAuth';
import { Plus, Car } from 'lucide-react';
import OptimizedPremiumCheck from '@/components/premium/OptimizedPremiumCheck';
import ResponsivePage from '@/components/layouts/ResponsivePage';
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorBoundaryWithFallback';
import FastLoadingFallback from '@/components/common/FastLoadingFallback';
import { useVehicleManagement } from '@/hooks/vehicle/useVehicleManagement';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Lazy load vehicle components with proper fallbacks
const VehicleForm = React.lazy(() => import('@/components/vehicle/VehicleForm'));

const VehicleSelectorOptimized = React.lazy(() => 
  import('@/components/vehicle/VehicleSelectorOptimized').catch(() => ({
    default: () => null
  }))
);

const VehicleNavigation = React.lazy(() => 
  import('@/components/vehicle/VehicleNavigation').catch(() => ({
    default: () => <div className="p-4 text-center text-muted-foreground">Navigace se nenačetla</div>
  }))
);

const FuelConsumptionCard = React.lazy(() => 
  import('@/components/vehicle/FuelConsumptionCard').catch(() => ({
    default: () => <div className="p-4 text-center text-muted-foreground">Spotřeba se nenačetla</div>
  }))
);

const ServiceRecordCard = React.lazy(() => 
  import('@/components/vehicle/ServiceRecordCard').catch(() => ({
    default: () => <div className="p-4 text-center text-muted-foreground">Servis se nenačetl</div>
  }))
);

const InsuranceCard = React.lazy(() => 
  import('@/components/vehicle/InsuranceCard').catch(() => ({
    default: () => <div className="p-4 text-center text-muted-foreground">Pojištění se nenačetlo</div>
  }))
);

const DocumentsCard = React.lazy(() => 
  import('@/components/vehicle/DocumentsCard').catch(() => ({
    default: () => <div className="p-4 text-center text-muted-foreground">Dokumenty se nenačetly</div>
  }))
);

const EmptyVehicleState = React.lazy(() => 
  import('@/components/vehicle/EmptyVehicleState').catch(() => ({
    default: ({ onAddVehicle }: { onAddVehicle: () => void }) => (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">Nemáte ještě žádné vozidlo</p>
        <Button onClick={onAddVehicle}>Přidat vozidlo</Button>
      </div>
    )
  }))
);

const Vehicle = () => {
  const { user, isInitialized } = useSimplifiedAuth();
  const isMobile = useIsMobile();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const {
    vehicles,
    selectedVehicle,
    selectedVehicleId,
    isLoading,
    isSaving,
    addVehicle,
    selectVehicle
  } = useVehicleManagement(user?.id);

  const handleAddVehicle = async (formData: any) => {
    const newVehicle = await addVehicle(formData);
    if (newVehicle) {
      setIsAddSheetOpen(false);
    }
  };

  const renderTabContent = () => {
    if (!selectedVehicle || !selectedVehicleId) return null;

    switch (activeTab) {
      case "overview":
        return (
          <div className={cn(
            "space-y-6",
            isMobile ? "space-y-4" : ""
          )}>
            <div className={cn(
              "grid gap-6",
              isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 lg:grid-cols-2"
            )}>
              <div className="space-y-6">
                <React.Suspense fallback={<FastLoadingFallback minimal />}>
                  <FuelConsumptionCard vehicleId={selectedVehicleId} />
                </React.Suspense>
                <React.Suspense fallback={<FastLoadingFallback minimal />}>
                  <ServiceRecordCard vehicleId={selectedVehicleId} />
                </React.Suspense>
              </div>
              <div className="space-y-6">
                <React.Suspense fallback={<FastLoadingFallback minimal />}>
                  <InsuranceCard vehicleId={selectedVehicleId} />
                </React.Suspense>
                <React.Suspense fallback={<FastLoadingFallback minimal />}>
                  <DocumentsCard vehicleId={selectedVehicleId} />
                </React.Suspense>
              </div>
            </div>
          </div>
        );
      case "fuel":
        return (
          <React.Suspense fallback={<FastLoadingFallback />}>
            <FuelConsumptionCard vehicleId={selectedVehicleId} fullView />
          </React.Suspense>
        );
      case "service":
        return (
          <React.Suspense fallback={<FastLoadingFallback />}>
            <ServiceRecordCard vehicleId={selectedVehicleId} fullView />
          </React.Suspense>
        );
      case "documents":
        return (
          <React.Suspense fallback={<FastLoadingFallback />}>
            <DocumentsCard vehicleId={selectedVehicleId} fullView />
          </React.Suspense>
        );
      default:
        return null;
    }
  };

  // Show loading while auth is initializing
  if (!isInitialized || isLoading) {
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
        <ErrorBoundaryWithFallback>
          <div className="container max-w-7xl mx-auto px-4">
            <Helmet>
              <title>Vozidlo | Pendlerův Pomocník</title>
            </Helmet>
            
            {/* Header */}
            <div className={cn(
              "flex justify-between items-center mb-6",
              isMobile ? "flex-col gap-4 items-stretch mb-4" : ""
            )}>
              <div className={cn(isMobile ? "text-center" : "")}>
                <h1 className={cn(
                  "font-bold tracking-tight",
                  isMobile ? "text-2xl" : "text-3xl"
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
                  isMobile ? "w-full justify-center" : ""
                )}
              >
                <Plus className="h-4 w-4" />
                {isMobile ? 'Přidat vozidlo' : 'Přidat vozidlo'}
              </Button>
            </div>
            
            {vehicles.length === 0 ? (
              <React.Suspense fallback={<FastLoadingFallback />}>
                <EmptyVehicleState onAddVehicle={() => setIsAddSheetOpen(true)} />
              </React.Suspense>
            ) : (
              <>
                {/* Vehicle selector */}
                {vehicles.length > 1 && (
                  <div className="mb-6">
                    <React.Suspense fallback={<div />}>
                      <VehicleSelectorOptimized
                        vehicles={vehicles}
                        selectedVehicleId={selectedVehicleId}
                        onSelect={selectVehicle}
                        className={isMobile ? "w-full" : ""}
                      />
                    </React.Suspense>
                  </div>
                )}
                
                {selectedVehicle && (
                  <>
                    {/* Navigation */}
                    <div className="mb-6">
                      <React.Suspense fallback={<FastLoadingFallback minimal />}>
                        <VehicleNavigation
                          activeTab={activeTab}
                          onTabChange={setActiveTab}
                        />
                      </React.Suspense>
                    </div>
                    
                    {/* Content */}
                    <div className="pb-6">
                      <ErrorBoundaryWithFallback>
                        {renderTabContent()}
                      </ErrorBoundaryWithFallback>
                    </div>
                  </>
                )}
              </>
            )}
            
            {/* Add Vehicle Sheet */}
            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
              <SheetContent className={cn(
                "overflow-y-auto",
                isMobile ? "w-full" : "sm:max-w-2xl"
              )}>
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
                  <React.Suspense fallback={<FastLoadingFallback />}>
                    <VehicleForm
                      onSubmit={handleAddVehicle}
                      onCancel={() => setIsAddSheetOpen(false)}
                      isLoading={isSaving}
                    />
                  </React.Suspense>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </ErrorBoundaryWithFallback>
      </ResponsivePage>
    </OptimizedPremiumCheck>
  );
};

export default Vehicle;
