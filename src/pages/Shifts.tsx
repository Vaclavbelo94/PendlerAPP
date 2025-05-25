
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import PremiumCheck from '@/components/premium/PremiumCheck';
import ResponsivePage from "@/components/layouts/ResponsivePage";

// Import refactored components
import { ShiftsHeader } from "@/components/shifts/ShiftsHeader";
import { ShiftsNavigation } from "@/components/shifts/ShiftsNavigation";
import { ShiftsContent } from "@/components/shifts/ShiftsContent";
import { useUnifiedShiftManagement } from "@/components/shifts/hooks/useUnifiedShiftManagement";
import { EditNoteDialog } from "@/components/shifts/EditNoteDialog";
import { MobileShiftActions } from "@/components/shifts/mobile/MobileShiftActions";
import { ShiftWidgets } from "@/components/shifts/dashboard/ShiftWidgets";

const Shifts = () => {
  const [activeSection, setActiveSection] = useState("calendar");
  const { user } = useAuth();

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
    isLoading
  } = useUnifiedShiftManagement(user);

  const handleOpenNoteDialog = () => {
    setNoteDialogOpen(true);
  };

  const handleSaveNote = () => {
    handleSaveNotes(shiftNotes);
  };

  const handleQuickAdd = () => {
    setActiveSection("calendar");
    setSelectedDate(new Date());
  };

  const handleNotificationSettings = () => {
    // TODO: Open notification settings dialog
  };

  const handleShareSchedule = () => {
    // TODO: Implement share functionality
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
        <div className="container py-6 md:py-10 max-w-7xl mx-auto">
          <ShiftsHeader />

          <MobileShiftActions
            onQuickAdd={handleQuickAdd}
            onNotificationSettings={handleNotificationSettings}
            onShareSchedule={handleShareSchedule}
          />

          <ShiftWidgets shifts={shifts} />

          <ShiftsNavigation 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
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
