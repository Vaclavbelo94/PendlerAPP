import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PremiumCheck from '@/components/premium/PremiumCheck';
import {
  CalendarIcon,
  BarChartIcon,
  FileTextIcon,
  MapIcon
} from "lucide-react";

// Import responsive components
import { ResponsiveTabs, ResponsiveTabsList, ResponsiveTabsTrigger, ResponsiveTabsContent } from "@/components/ui/responsive-tabs";
import ResponsivePage from "@/components/layouts/ResponsivePage";

// Import refactored components
import { ShiftCalendarTab } from "@/components/shifts/ShiftCalendarTab";
import { ReportsTab } from "@/components/shifts/ReportsTab";
import ShiftAnalytics from "@/components/shifts/ShiftAnalytics";
import { useRefactoredShiftManagement } from "@/components/shifts/hooks/useRefactoredShiftManagement";
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
    handleSaveNotes,
    isLoading
  } = useRefactoredShiftManagement(user);

  const handleOpenNoteDialog = () => {
    setNoteDialogOpen(true);
  };

  const handleSaveNote = () => {
    handleSaveNotes(shiftNotes);
  };

  const handleNavigateToTravel = () => {
    navigate('/travel-planning');
  };

  if (isLoading) {
    return (
      <PremiumCheck featureKey="shifts">
        <ResponsivePage>
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </ResponsivePage>
      </PremiumCheck>
    );
  }

  return (
    <PremiumCheck featureKey="shifts">
      <ResponsivePage>
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

          <ResponsiveTabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <ResponsiveTabsList>
              <ResponsiveTabsTrigger 
                value="calendar" 
                icon={<CalendarIcon className="h-5 w-5" />}
                description="Přehled směn"
              >
                Kalendář
              </ResponsiveTabsTrigger>
              <ResponsiveTabsTrigger 
                value="analytics" 
                icon={<BarChartIcon className="h-5 w-5" />}
                description="Statistiky"
              >
                Analýzy
              </ResponsiveTabsTrigger>
              <ResponsiveTabsTrigger 
                value="reports" 
                icon={<FileTextIcon className="h-5 w-5" />}
                description="Měsíční přehledy"
              >
                Reporty
              </ResponsiveTabsTrigger>
            </ResponsiveTabsList>

            <ResponsiveTabsContent value="calendar" className="space-y-6">
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
            </ResponsiveTabsContent>

            <ResponsiveTabsContent value="analytics" className="space-y-6">
              <ShiftAnalytics 
                shifts={shifts}
                period={analyticsPeriod}
                onPeriodChange={setAnalyticsPeriod}
              />
            </ResponsiveTabsContent>

            <ResponsiveTabsContent value="reports" className="space-y-6">
              <ReportsTab shifts={shifts} user={user} />
            </ResponsiveTabsContent>
          </ResponsiveTabs>

          <EditNoteDialog
            open={noteDialogOpen}
            onOpenChange={setNoteDialogOpen}
            selectedDate={selectedDate}
            shiftNotes={shiftNotes}
            onNotesChange={setShiftNotes}
            onSaveNote={handleSaveNote}
          />
        </div>
      </ResponsivePage>
    </PremiumCheck>
  );
};

export default Shifts;
