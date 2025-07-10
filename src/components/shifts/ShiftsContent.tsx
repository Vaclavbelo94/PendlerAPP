
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, ListFilter, FileSpreadsheet, Zap } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';
import { ShiftCalendar } from './ShiftCalendar';
import ShiftsList from './ShiftsList';
import ShiftForm from './ShiftForm';
import ShiftStats from './ShiftStats';
import ShiftFilters from './ShiftFilters';
import EmptyShiftsState from './EmptyShiftsState';
import { ShiftType, AnalyticsPeriod } from './types';
import SimpleLoadingSpinner from '@/components/loading/SimpleLoadingSpinner';
import { useShiftsCRUD, Shift, ShiftFormData } from '@/hooks/shifts/useShiftsCRUD';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { generateUserShifts } from '@/services/dhl/shiftGenerator';
import { toast } from 'sonner';
import MobileShiftActions from './mobile/MobileShiftActions';
import { useIsMobile } from '@/hooks/use-mobile';

const ShiftsContent = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { success, error } = useStandardizedToast();
  const { t } = useTranslation('shifts');
  const isMobile = useIsMobile();
  
  // Use database hooks instead of localStorage
  const {
    shifts,
    isLoading,
    createShift,
    updateShift,
    deleteShift,
    refreshShifts,
  } = useShiftsCRUD();

  // DHL functionality
  const { userAssignment } = useDHLData(user?.id || null);
  const [isDHLGenerating, setIsDHLGenerating] = useState(false);
  
  // Debug output
  console.log('ShiftsContent - userAssignment:', userAssignment);
  console.log('ShiftsContent - should show DHL button:', !!userAssignment);
  
  const [activeTab, setActiveTab] = useState('calendar');
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    shiftType: 'all',
    location: 'all',
    minHours: 0,
    maxHours: 24
  });

  // Handle DHL shift generation
  const handleGenerateDHLShifts = useCallback(async () => {
    if (!user?.id) {
      toast.error('Uživatel není přihlášen');
      return;
    }

    setIsDHLGenerating(true);
    try {
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      
      const result = await generateUserShifts(
        user.id,
        startDate,
        endDate.toISOString().split('T')[0]
      );

      if (result.success) {
        toast.success(`✅ ${result.message}`);
        refreshShifts(); // Refresh to show new shifts
      } else {
        toast.error(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('DHL shift generation error:', error);
      toast.error('Chyba při generování DHL směn');
    } finally {
      setIsDHLGenerating(false);
    }
  }, [user?.id, refreshShifts]);

  const handleAddShift = async (shiftData: any) => {
    try {
      const formData: ShiftFormData = {
        type: shiftData.type,
        start_time: shiftData.start_time,
        end_time: shiftData.end_time,
        notes: shiftData.notes
      };
      
      const success = await createShift(new Date(shiftData.date), formData);
      
      if (success) {
        setIsAddSheetOpen(false);
      }
    } catch (err) {
      console.error('Error adding shift:', err);
    }
  };

  const handleUpdateShift = async (shiftId: string, updatedData: any) => {
    try {
      const formData: ShiftFormData = {
        type: updatedData.type,
        start_time: updatedData.start_time,
        end_time: updatedData.end_time,
        notes: updatedData.notes
      };
      
      await updateShift(shiftId, formData);
    } catch (err) {
      console.error('Error updating shift:', err);
    }
  };

  const handleDeleteShift = async (shiftId: string) => {
    try {
      await deleteShift(shiftId);
    } catch (err) {
      console.error('Error deleting shift:', err);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsFilterSheetOpen(false);
  };

  const filteredShifts = shifts.filter(shift => {
    // Apply date filters
    if (filters.startDate && new Date(shift.date) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(shift.date) > new Date(filters.endDate)) {
      return false;
    }
    
    // Apply shift type filter
    if (filters.shiftType !== 'all' && shift.type !== filters.shiftType) {
      return false;
    }
    
    return true;
  });

  // Show loading while auth is loading or data is loading
  if (authLoading || isLoading) {
    return <SimpleLoadingSpinner message={t('loadingShifts')} />;
  }

  // Show empty state for new users
  if (shifts.length === 0) {
    return <EmptyShiftsState onAddShift={() => setIsAddSheetOpen(true)} />;
  }

  return (
    <div className="space-y-6">
      {/* Mobile Actions */}
      {isMobile && (
        <MobileShiftActions
          onQuickAdd={() => setIsAddSheetOpen(true)}
          onNotificationSettings={() => setIsFilterSheetOpen(true)}
          onShareSchedule={() => {}}
          userAssignment={userAssignment}
          handleGenerateDHLShifts={handleGenerateDHLShifts}
          isDHLGenerating={isDHLGenerating}
        />
      )}

      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('calendar')}
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                {t('list')}
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                {t('statistics')}
              </TabsTrigger>
            </TabsList>
            
            {/* Desktop Actions */}
            {!isMobile && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsFilterSheetOpen(true)}
                  className="flex items-center gap-2"
                >
                  <ListFilter className="h-4 w-4" />
                  {t('filter')}
                </Button>
                
                {userAssignment && (
                  <Button
                    onClick={handleGenerateDHLShifts}
                    disabled={isDHLGenerating}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    {isDHLGenerating ? 'Generuji...' : 'Generovat DHL směny'}
                  </Button>
                )}
                
                <Button 
                  size="sm" 
                  onClick={() => setIsAddSheetOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t('add')}
                </Button>
              </div>
            )}
          </div>
          
          <TabsContent value="calendar" className="mt-0">
            <ShiftCalendar 
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              shifts={filteredShifts as any} 
              onUpdateShift={handleUpdateShift}
              onDeleteShift={handleDeleteShift}
            />
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <ShiftsList 
              shifts={filteredShifts as any} 
              onUpdateShift={handleUpdateShift}
              onDeleteShift={handleDeleteShift}
            />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-0">
            <ShiftStats shifts={filteredShifts as any} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Sheet for adding new shift */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t('addNewShift')}</SheetTitle>
            <SheetDescription>
              {t('fillShiftDetails')}
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <ShiftForm onSubmit={handleAddShift} onCancel={() => setIsAddSheetOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Sheet for filters */}
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t('filterShifts')}</SheetTitle>
            <SheetDescription>
              {t('setFiltersForShifts')}
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <ShiftFilters 
              filters={filters} 
              onApplyFilters={handleApplyFilters} 
              onCancel={() => setIsFilterSheetOpen(false)} 
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ShiftsContent;
