
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  BarChartIcon,
  FileTextIcon,
  MapIcon
} from "lucide-react";

// Import existing components with correct named imports
import { ShiftCalendarTab } from "@/components/shifts/ShiftCalendarTab";
import { ReportsTab } from "@/components/shifts/ReportsTab";
import ShiftAnalytics from "@/components/shifts/ShiftAnalytics";
import { useShiftManagement } from "@/components/shifts/useShiftManagement";
import { EditNoteDialog } from "@/components/shifts/EditNoteDialog";

const Shifts = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    selectedDate,
    setSelectedDate,
    shifts,
    shiftType,
    setShiftType,
    shiftNotes,
    setShiftNotes,
    selectedMonth,
    setSelectedMonth,
    analyticsPeriod,
    setAnalyticsPeriod,
    noteDialogOpen,
    setNoteDialogOpen,
    exportDialogOpen,
    setExportDialogOpen,
    currentShift,
    handleSaveShift,
    handleDeleteShift,
    handleSaveNotes
  } = useShiftManagement(user);

  const handleOpenNoteDialog = () => {
    setNoteDialogOpen(true);
  };

  const handleSaveNote = () => {
    handleSaveNotes(shiftNotes);
  };

  const handleNavigateToTravel = () => {
    navigate('/travel-planning');
  };

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Směny</h1>
        <p className="text-muted-foreground">
          Plánujte a sledujte své pracovní směny efektivně
        </p>
        
        {/* Quick link to travel planning */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Potřebujete naplánovat cestu?</h3>
              <p className="text-sm text-muted-foreground">
                Optimalizujte své dojíždění a najděte spolujízdy v sekci Doprava
              </p>
            </div>
            <Button onClick={handleNavigateToTravel} className="flex items-center gap-2">
              <MapIcon className="h-4 w-4" />
              Plánování cest
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} ${isMobile ? 'max-w-full' : 'max-w-3xl'} h-auto`}>
          <TabsTrigger value="calendar" className="flex flex-col items-center gap-1 py-3 px-4">
            <CalendarIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Kalendář</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Přehled směn</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex flex-col items-center gap-1 py-3 px-4">
            <BarChartIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Analýzy</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Statistiky</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex flex-col items-center gap-1 py-3 px-4">
            <FileTextIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Reporty</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Měsíční přehledy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <ShiftCalendarTab 
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            shifts={shifts}
            currentShift={currentShift}
            shiftType={shiftType}
            setShiftType={setShiftType}
            shiftNotes={shiftNotes}
            setShiftNotes={setShiftNotes}
            user={user}
            onSaveShift={handleSaveShift}
            onDeleteShift={handleDeleteShift}
            onOpenNoteDialog={handleOpenNoteDialog}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ShiftAnalytics 
            shifts={shifts}
            period={analyticsPeriod}
            onPeriodChange={setAnalyticsPeriod}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ReportsTab shifts={shifts} user={user} />
        </TabsContent>
      </Tabs>

      <EditNoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        selectedDate={selectedDate}
        shiftNotes={shiftNotes}
        onNotesChange={setShiftNotes}
        onSaveNote={handleSaveNote}
      />
    </div>
  );
};

export default Shifts;
