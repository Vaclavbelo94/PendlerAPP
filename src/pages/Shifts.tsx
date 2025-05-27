
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { Plus, Calendar } from 'lucide-react';
import { useSimplifiedAuth } from '@/hooks/auth/useSimplifiedAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import OptimizedPremiumCheck from '@/components/premium/OptimizedPremiumCheck';
import ResponsivePage from '@/components/layouts/ResponsivePage';
import FastLoadingFallback from '@/components/common/FastLoadingFallback';
import { ShiftsNavigation } from '@/components/shifts/ShiftsNavigation';
import { useShiftsManagement } from '@/hooks/useShiftsManagement';
import ShiftForm from '@/components/shifts/ShiftForm';
import ShiftsOverview from '@/components/shifts/ShiftsOverview';
import ShiftsCalendar from '@/components/shifts/ShiftsCalendar';
import ShiftsAnalytics from '@/components/shifts/ShiftsAnalytics';
import ShiftsSettings from '@/components/shifts/ShiftsSettings';
import ShiftsReports from '@/components/shifts/ShiftsReports';
import EmptyShiftsState from '@/components/shifts/EmptyShiftsState';
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorBoundaryWithFallback';

const Shifts = () => {
  const { user, isInitialized } = useSimplifiedAuth();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState('calendar');
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);

  const {
    shifts,
    isLoading,
    error,
    addShift,
    updateShift,
    deleteShift,
    isSaving
  } = useShiftsManagement(user?.id);

  const handleAddShift = async (formData) => {
    const newShift = await addShift(formData);
    if (newShift !== null) {
      setIsAddSheetOpen(false);
    }
  };

  const handleEditShift = async (formData) => {
    if (!editingShift) return;
    
    const updatedShift = await updateShift({ ...formData, id: editingShift.id });
    if (updatedShift !== null) {
      setIsEditSheetOpen(false);
      setEditingShift(null);
    }
  };

  const openEditDialog = (shift) => {
    setEditingShift(shift);
    setIsEditSheetOpen(true);
  };

  const renderSectionContent = () => {
    if (shifts.length === 0 && activeSection === 'calendar') {
      return <EmptyShiftsState onAddShift={() => setIsAddSheetOpen(true)} />;
    }

    switch (activeSection) {
      case 'calendar':
        return (
          <ShiftsCalendar 
            shifts={shifts}
            onEditShift={openEditDialog}
            onDeleteShift={deleteShift}
          />
        );
      case 'analytics':
        return <ShiftsAnalytics shifts={shifts} />;
      case 'reports':
        return <ShiftsReports shifts={shifts} />;
      case 'settings':
        return <ShiftsSettings />;
      default:
        return (
          <ShiftsOverview 
            shifts={shifts}
            onEditShift={openEditDialog}
            onDeleteShift={deleteShift}
          />
        );
    }
  };

  if (!isInitialized) {
    return (
      <OptimizedPremiumCheck featureKey="shifts">
        <ResponsivePage>
          <FastLoadingFallback message="Inicializace..." />
        </ResponsivePage>
      </OptimizedPremiumCheck>
    );
  }

  if (isLoading) {
    return (
      <OptimizedPremiumCheck featureKey="shifts">
        <ResponsivePage>
          <FastLoadingFallback message="Načítání směn..." />
        </ResponsivePage>
      </OptimizedPremiumCheck>
    );
  }

  return (
    <OptimizedPremiumCheck featureKey="shifts">
      <ResponsivePage enableMobileSafeArea>
        <div className="container max-w-7xl mx-auto px-4">
          <Helmet>
            <title>Směny | Pendlerův Pomocník</title>
          </Helmet>
          
          {/* Header */}
          <div className={cn("flex justify-between items-center mb-6", isMobile ? "flex-col gap-4 items-stretch mb-4" : "")}>
            <div className={cn(isMobile ? "text-center" : "")}>
              <h1 className={cn("font-bold tracking-tight", isMobile ? "text-2xl" : "text-3xl")}>
                Směny
              </h1>
              <p className={cn("text-muted-foreground", isMobile ? "text-sm" : "text-base")}>
                Správa vašich pracovních směn a rozvrhu
              </p>
            </div>
            
            <Button 
              onClick={() => setIsAddSheetOpen(true)} 
              className={cn("flex items-center gap-2", isMobile ? "w-full justify-center" : "")}
            >
              <Plus className="h-4 w-4" />
              Přidat směnu
            </Button>
          </div>

          <ErrorBoundaryWithFallback>
            {/* Navigation */}
            <div className="mb-6">
              <ShiftsNavigation
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>

            {/* Content */}
            <div className="pb-6">
              {renderSectionContent()}
            </div>
          </ErrorBoundaryWithFallback>

          {/* Add Shift Sheet */}
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetContent className={cn("overflow-y-auto", isMobile ? "w-full" : "sm:max-w-2xl")}>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Přidat novou směnu
                </SheetTitle>
                <SheetDescription>
                  Vyplňte údaje o vaší pracovní směně. Všechna pole označená * jsou povinná.
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6">
                <ShiftForm
                  onSubmit={handleAddShift}
                  onCancel={() => setIsAddSheetOpen(false)}
                  isLoading={isSaving}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Edit Shift Sheet */}
          <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
            <SheetContent className={cn("overflow-y-auto", isMobile ? "w-full" : "sm:max-w-2xl")}>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upravit směnu
                </SheetTitle>
                <SheetDescription>
                  Upravte údaje o vaší pracovní směně.
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6">
                <ShiftForm
                  onSubmit={handleEditShift}
                  onCancel={() => {
                    setIsEditSheetOpen(false);
                    setEditingShift(null);
                  }}
                  isLoading={isSaving}
                  shift={editingShift}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </ResponsivePage>
    </OptimizedPremiumCheck>
  );
};

export default Shifts;
