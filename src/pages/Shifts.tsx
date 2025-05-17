
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumCheck from '@/components/premium/PremiumCheck';
import { PlanningTab } from '@/components/shifts/PlanningTab';
import { ShiftCalendarTab } from '@/components/shifts/ShiftCalendarTab';
import { ReportsTabContent } from '@/components/shifts/ReportsTabContent';
import { EditNoteDialog } from '@/components/shifts/EditNoteDialog';
import { ExportPdfDialog } from '@/components/shifts/ExportPdfDialog';
import { useShiftManagement } from '@/components/shifts/useShiftManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Shifts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("planning");
  
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
  
  // Use the shift management hook to handle state and operations
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
              onOpenNoteDialog={() => setNoteDialogOpen(true)}
            />
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <ReportsTabContent
              shifts={shifts}
              user={user}
              selectedMonth={selectedMonth}
              onSelectDate={setSelectedDate}
              analyticsPeriod={analyticsPeriod}
              onPeriodChange={setAnalyticsPeriod}
            />
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
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          user={user}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      </div>
    </PremiumCheck>
  );
};

export default Shifts;
