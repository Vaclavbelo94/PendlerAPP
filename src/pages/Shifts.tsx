
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import PremiumCheck from '@/components/premium/PremiumCheck';
import {
  CalendarIcon,
  BarChartIcon,
  FileTextIcon,
  MapIcon
} from "lucide-react";

// Import responsive components
import ResponsivePage from "@/components/layouts/ResponsivePage";

// Import refactored components
import { ShiftCalendarTab } from "@/components/shifts/ShiftCalendarTab";
import { ReportsTab } from "@/components/shifts/ReportsTab";
import ShiftAnalytics from "@/components/shifts/ShiftAnalytics";
import { useRefactoredShiftManagement } from "@/components/shifts/hooks/useRefactoredShiftManagement";
import { EditNoteDialog } from "@/components/shifts/EditNoteDialog";

const Shifts = () => {
  const [activeSection, setActiveSection] = useState("calendar");
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

          {/* Grid menu similar to Calculator */}
          <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-4 mb-8`}>
            <Card 
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                activeSection === "calendar" ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => setActiveSection("calendar")}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <CalendarIcon className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Kalendář</h3>
                  <p className="text-sm text-muted-foreground">Přehled směn</p>
                </div>
              </div>
            </Card>

            <Card 
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                activeSection === "analytics" ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => setActiveSection("analytics")}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <BarChartIcon className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Analýzy</h3>
                  <p className="text-sm text-muted-foreground">Statistiky</p>
                </div>
              </div>
            </Card>

            <Card 
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                activeSection === "reports" ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => setActiveSection("reports")}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <FileTextIcon className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Reporty</h3>
                  <p className="text-sm text-muted-foreground">Měsíční přehledy</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Content sections */}
          <div className="space-y-6">
            {activeSection === "calendar" && (
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
            )}

            {activeSection === "analytics" && (
              <ShiftAnalytics 
                shifts={shifts}
                period={analyticsPeriod}
                onPeriodChange={setAnalyticsPeriod}
              />
            )}

            {activeSection === "reports" && (
              <ReportsTab shifts={shifts} user={user} />
            )}
          </div>

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
