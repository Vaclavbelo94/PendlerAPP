
import React, { useState, useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import { UniversalMobileNavigation } from "@/components/navigation/UniversalMobileNavigation";
import PremiumCheck from '@/components/premium/PremiumCheck';
import ResponsivePage from "@/components/layouts/ResponsivePage";
import { ShiftsErrorBoundary } from "@/components/shifts/ShiftsErrorBoundary";

// Import refactored components
import { ShiftsHeader } from "@/components/shifts/ShiftsHeader";
import ShiftsContent from "@/components/shifts/ShiftsContent";
import { useUnifiedShiftManagement } from "@/components/shifts/hooks/useUnifiedShiftManagement";
import { LazyEditNoteDialog } from "@/components/shifts/lazy/LazyShiftComponents";
import MobileShiftActions from "@/components/shifts/mobile/MobileShiftActions";
import { ShiftWidgets } from "@/components/shifts/dashboard/ShiftWidgets";
import { Calendar, BarChart3, FileText, Settings } from "lucide-react";

const Shifts = () => {
  const [activeSection, setActiveSection] = useState("calendar");
  const { user } = useAuth();
  const { isMobile } = useScreenOrientation();

  const shiftTabs = [
    {
      id: "calendar",
      label: "Kalendář",
      icon: Calendar,
      description: "Plánování a správa směn"
    },
    {
      id: "analytics",
      label: "Analýzy",
      icon: BarChart3,
      description: "Statistiky a grafy směn"
    },
    {
      id: "reports",
      label: "Reporty",
      icon: FileText,
      description: "Exporty a sestavy"
    },
    {
      id: "settings",
      label: "Nastavení",
      icon: Settings,
      description: "Konfigurace směn"
    }
  ];

  const {
    selectedDate,
    setSelectedDate,
    shifts,
    shiftType,
    setShiftType,
    shiftNotes,
    setShiftNotes,
    analyticsPeriod,
    setAnalyticsPeriod,
    noteDialogOpen,
    setNoteDialogOpen,
    currentShift,
    handleSaveShift,
    handleDeleteShift,
    handleSaveNotes,
    handleAdvancedSync,
    isLoading
  } = useUnifiedShiftManagement(user);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleOpenNoteDialog = useCallback(() => {
    setNoteDialogOpen(true);
  }, [setNoteDialogOpen]);

  const handleSaveNote = useCallback(() => {
    handleSaveNotes(shiftNotes);
  }, [handleSaveNotes, shiftNotes]);

  const handleQuickAdd = useCallback(() => {
    setActiveSection("calendar");
    setSelectedDate(new Date());
  }, [setSelectedDate]);

  const handleNotificationSettings = useCallback(() => {
    setActiveSection("settings");
  }, []);

  const handleShareSchedule = useCallback(() => {
    setActiveSection("reports");
  }, []);

  // Memoized widgets component
  const shiftsWidgets = useMemo(() => (
    <ShiftWidgets shifts={shifts} />
  ), [shifts]);

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
        <ShiftsErrorBoundary>
          <div className="container py-6 md:py-10 max-w-7xl mx-auto">
            <ShiftsHeader />

            <MobileShiftActions
              onQuickAdd={handleQuickAdd}
              onNotificationSettings={handleNotificationSettings}
              onShareSchedule={handleShareSchedule}
            />

            {shiftsWidgets}

            <UniversalMobileNavigation
              activeTab={activeSection}
              onTabChange={setActiveSection}
              tabs={shiftTabs}
            />

            <ShiftsContent
              activeSection={activeSection}
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
              analyticsPeriod={analyticsPeriod}
              setAnalyticsPeriod={setAnalyticsPeriod}
            />

            <LazyEditNoteDialog
              open={noteDialogOpen}
              onOpenChange={setNoteDialogOpen}
              selectedDate={selectedDate}
              shiftNotes={shiftNotes}
              onNotesChange={setShiftNotes}
              onSaveNote={handleSaveNote}
            />
          </div>
        </ShiftsErrorBoundary>
      </ResponsivePage>
    </PremiumCheck>
  );
};

export default Shifts;
