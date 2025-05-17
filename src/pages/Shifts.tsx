import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumCheck from '@/components/premium/PremiumCheck';
import { ShiftCalendar } from '@/components/shifts/ShiftCalendar';
import { ShiftDetails } from '@/components/shifts/ShiftDetails';
import { PlanningTab } from '@/components/shifts/PlanningTab';
import { MonthlyReport } from '@/components/shifts/MonthlyReport';
import ShiftAnalytics from '@/components/shifts/ShiftAnalytics';
import { ReportsTab } from '@/components/shifts/ReportsTab';
import { ExportPdfDialog } from '@/components/shifts/ExportPdfDialog';
import { EditNoteDialog } from '@/components/shifts/EditNoteDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from '@/hooks/use-media-query';
import { useDeviceSize } from '@/hooks/use-mobile';
import { Shift, ShiftType, AnalyticsPeriod } from '@/components/shifts/types';
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const Shifts = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftType, setShiftType] = useState<ShiftType>("morning");
  const [shiftNotes, setShiftNotes] = useState("");
  const [activeTab, setActiveTab] = useState("planning");
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [analyticsPeriod, setAnalyticsPeriod] = useState<AnalyticsPeriod>("month");
  
  const isMobile = useDeviceSize() === "mobile";
  const isTablet = useMediaQuery("md");

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("currentUser");
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error("Error fetching user:", e);
      return null;
    }
  };
  
  const user = getCurrentUser();
  
  // Load shifts from localStorage on component mount
  useEffect(() => {
    try {
      const savedShifts = localStorage.getItem("shifts");
      if (savedShifts) {
        setShifts(JSON.parse(savedShifts));
      }
    } catch (e) {
      console.error("Error loading shifts:", e);
    }
  }, []);
  
  // Save shifts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("shifts", JSON.stringify(shifts));
    } catch (e) {
      console.error("Error saving shifts:", e);
    }
  }, [shifts]);
  
  // Find current shift for the selected date
  const getCurrentShift = () => {
    if (!selectedDate) return null;
    
    return shifts.find(
      (shift) => new Date(shift.date).toDateString() === selectedDate.toDateString()
    );
  };
  
  const currentShift = getCurrentShift();
  
  // Set shiftType and notes when currentShift changes
  useEffect(() => {
    if (currentShift) {
      setShiftType(currentShift.type);
      setShiftNotes(currentShift.notes || "");
    } else {
      setShiftType("morning");
      setShiftNotes("");
    }
  }, [currentShift]);
  
  // Handle saving shift
  const handleSaveShift = () => {
    if (!selectedDate || !user) return;
    
    const newShift = {
      id: currentShift?.id || Date.now().toString(),
      date: selectedDate.toISOString(),
      type: shiftType,
      notes: shiftNotes.trim(),
      userId: user.id || user.email
    };
    
    let updatedShifts;
    
    if (currentShift) {
      // Update existing shift
      updatedShifts = shifts.map(
        (shift) => (shift.id === currentShift.id ? newShift : shift)
      );
      toast({
        title: "Směna aktualizována",
        description: `Směna byla úspěšně upravena.`,
      });
    } else {
      // Add new shift
      updatedShifts = [...shifts, newShift];
      toast({
        title: "Směna přidána",
        description: `Nová směna byla úspěšně přidána.`,
      });
    }
    
    setShifts(updatedShifts);
  };
  
  // Handle deleting shift
  const handleDeleteShift = () => {
    if (!currentShift) return;
    
    const updatedShifts = shifts.filter((shift) => shift.id !== currentShift.id);
    setShifts(updatedShifts);
    
    toast({
      title: "Směna odstraněna",
      description: `Směna byla úspěšně odstraněna.`,
      variant: "destructive"
    });
  };
  
  // Handle saving notes from dialog
  const handleSaveNotes = (notes: string) => {
    setShiftNotes(notes);
    // If there is a current shift, update it immediately
    if (currentShift) {
      handleSaveShift();
    }
    setNoteDialogOpen(false);
  };

  // Handle export
  const handleExport = () => {
    setExportDialogOpen(true);
  };

  return (
    <PremiumCheck featureKey="shifts">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Plánování směn</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="planning" className="flex-1">Plánování</TabsTrigger>
            <TabsTrigger value="calendar" className="flex-1">Kalendář</TabsTrigger>
            <TabsTrigger value="reports" className="flex-1">Přehledy</TabsTrigger>
          </TabsList>
          
          {/* Planning Tab */}
          <TabsContent value="planning" className="space-y-6">
            <PlanningTab 
              user={user} 
              onNavigateToLogin={() => navigate("/login")}
            />
          </TabsContent>
          
          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <div className={`grid ${isTablet ? "grid-cols-2" : "grid-cols-1"} gap-6`}>
              <Card className="p-4">
                <ShiftCalendar 
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  shifts={shifts}
                />
              </Card>
              
              <Card className="p-4">
                <ShiftDetails 
                  selectedDate={selectedDate}
                  currentShift={currentShift}
                  shiftType={shiftType}
                  setShiftType={setShiftType}
                  shiftNotes={shiftNotes}
                  setShiftNotes={setShiftNotes}
                  user={user}
                  onSaveShift={handleSaveShift}
                  onDeleteShift={handleDeleteShift}
                  onOpenNoteDialog={() => setNoteDialogOpen(true)}
                />
              </Card>
            </div>
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <MonthlyReport 
                  shifts={shifts}
                  user={user}
                  selectedMonth={selectedMonth}
                  onSelectDate={setSelectedDate}
                />
              </div>
              <div>
                <ShiftAnalytics 
                  shifts={shifts} 
                  period={analyticsPeriod}
                  onPeriodChange={setAnalyticsPeriod}
                />
              </div>
            </div>
            <ReportsTab shifts={shifts} user={user} />
          </TabsContent>
        </Tabs>
        
        {/* Dialogs */}
        <EditNoteDialog 
          open={noteDialogOpen} 
          onOpenChange={setNoteDialogOpen}
          selectedDate={selectedDate}
          shiftNotes={shiftNotes}
          onNotesChange={setShiftNotes}
          onSaveNote={handleSaveShift}
        />
        
        <ExportPdfDialog
          user={user}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      </div>
    </PremiumCheck>
  );
};

export default Shifts;
