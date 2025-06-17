import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, ListFilter, FileSpreadsheet } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { useAuth } from '@/hooks/useAuth';
import { ShiftCalendar } from './ShiftCalendar';
import ShiftsList from './ShiftsList';
import ShiftForm from './ShiftForm';
import ShiftStats from './ShiftStats';
import ShiftFilters from './ShiftFilters';
import EmptyShiftsState from './EmptyShiftsState';
import { ShiftType, AnalyticsPeriod } from './types';
import SimpleLoadingSpinner from '@/components/loading/SimpleLoadingSpinner';

const ShiftsContent = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { success, error } = useStandardizedToast();
  const [activeTab, setActiveTab] = useState('calendar');
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    shiftType: 'all',
    location: 'all',
    minHours: 0,
    maxHours: 24
  });
  
  useEffect(() => {
    const fetchShifts = async () => {
      if (!user || authLoading) {
        return;
      }

      try {
        setIsLoading(true);
        
        // For new users, start with empty array - no demo data
        const storedShifts = localStorage.getItem(`userShifts_${user.id}`);
        if (storedShifts) {
          const parsedShifts = JSON.parse(storedShifts);
          setShifts(parsedShifts.filter(shift => shift.userId === user.id));
        } else {
          // New user - start with empty shifts array
          setShifts([]);
        }
      } catch (error) {
        console.error('Error fetching shifts:', error);
        setShifts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch when we have a user and auth is not loading
    if (user && !authLoading) {
      fetchShifts();
    }
  }, [user, authLoading]);

  const handleAddShift = async (shiftData) => {
    try {
      const newShift = {
        id: Date.now().toString(),
        ...shiftData,
        userId: user?.id
      };
      
      const updatedShifts = [newShift, ...shifts];
      setShifts(updatedShifts);
      localStorage.setItem(`userShifts_${user.id}`, JSON.stringify(updatedShifts));
      
      setIsAddSheetOpen(false);
      success('Směna byla úspěšně přidána');
    } catch (err) {
      console.error('Error adding shift:', err);
      error('Chyba při přidání směny');
    }
  };

  const handleUpdateShift = async (id, updatedData) => {
    try {
      const updatedShifts = shifts.map(shift => 
        shift.id === id ? { ...shift, ...updatedData } : shift
      );
      
      setShifts(updatedShifts);
      localStorage.setItem(`userShifts_${user.id}`, JSON.stringify(updatedShifts));
      success('Směna byla aktualizována');
    } catch (err) {
      console.error('Error updating shift:', err);
      error('Chyba při aktualizaci směny');
    }
  };

  const handleDeleteShift = async (id) => {
    try {
      const updatedShifts = shifts.filter(shift => shift.id !== id);
      setShifts(updatedShifts);
      localStorage.setItem(`userShifts_${user.id}`, JSON.stringify(updatedShifts));
      success('Směna byla smazána');
    } catch (err) {
      console.error('Error deleting shift:', err);
      error('Chyba při mazání směny');
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
    
    // Apply location filter
    if (filters.location !== 'all' && shift.location !== filters.location) {
      return false;
    }
    
    // Apply hours filters
    const shiftHours = shift.hours || 0;
    if (shiftHours < filters.minHours || shiftHours > filters.maxHours) {
      return false;
    }
    
    return true;
  });

  // Show loading while auth is loading or data is loading
  if (authLoading || isLoading) {
    return <SimpleLoadingSpinner text="Načítání směn..." />;
  }

  // Show empty state for new users
  if (shifts.length === 0) {
    return <EmptyShiftsState onAddShift={() => setIsAddSheetOpen(true)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Kalendář
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Seznam
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Statistiky
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsFilterSheetOpen(true)}
                className="flex items-center gap-2"
              >
                <ListFilter className="h-4 w-4" />
                Filtrovat
              </Button>
              
              <Button 
                size="sm" 
                onClick={() => setIsAddSheetOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Přidat směnu
              </Button>
            </div>
          </div>
          
          <TabsContent value="calendar" className="mt-0">
            <ShiftCalendar 
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              shifts={filteredShifts} 
              onUpdateShift={handleUpdateShift}
              onDeleteShift={handleDeleteShift}
            />
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <ShiftsList 
              shifts={filteredShifts} 
              onUpdateShift={handleUpdateShift}
              onDeleteShift={handleDeleteShift}
            />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-0">
            <ShiftStats shifts={filteredShifts} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Sheet for adding new shift */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Přidat novou směnu</SheetTitle>
            <SheetDescription>
              Vyplňte detaily o vaší směně. Klikněte na uložit, až budete hotovi.
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
            <SheetTitle>Filtrovat směny</SheetTitle>
            <SheetDescription>
              Nastavte filtry pro zobrazení směn
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
