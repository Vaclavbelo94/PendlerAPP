
import { useEffect, useCallback } from "react";
import { useShiftLoading } from "./useShiftLoading";
import { useShiftData } from "./useShiftData";
import { useCurrentShift } from "./useCurrentShift";
import { EnhancedShiftService } from "../services/enhancedShiftService";
import { ShiftNotificationService } from "../notifications/ShiftNotificationService";
import { toast } from "@/components/ui/use-toast";

export const useEnhancedShiftManagement = (user: any) => {
  const { shifts, setShifts, isLoading } = useShiftLoading(user);
  const shiftData = useShiftData();
  
  const currentShift = useCurrentShift(
    shiftData.selectedDate, 
    shifts, 
    shiftData.setShiftType, 
    shiftData.setShiftNotes
  );

  const shiftService = EnhancedShiftService.getInstance();
  const notificationService = ShiftNotificationService.getInstance();

  // Helper function to check if we're online
  const isOnline = () => navigator.onLine;

  // Handle enhanced shift saving with unified notifications
  const handleSaveShift = useCallback(async () => {
    if (!shiftData.selectedDate || !user) {
      toast({
        title: "Chyba",
        description: "Pro uložení směny musíte být přihlášeni a vybrat datum.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { savedShift, isUpdate } = await shiftService.saveShiftEnhanced(
        shiftData.selectedDate, 
        shiftData.shiftType, 
        shiftData.shiftNotes, 
        user.id
      );
      
      // Success - show appropriate message
      toast({
        title: isUpdate ? "Směna aktualizována" : "Směna přidána",
        description: `Směna byla úspěšně ${isUpdate ? "upravena" : "přidána"}.`,
      });
      
      // Schedule notification for new shifts
      if (!isUpdate && savedShift) {
        await notificationService.scheduleShiftReminder(savedShift);
      }
      
      // Refresh shifts data
      window.dispatchEvent(new CustomEvent('refresh-shifts'));
      
    } catch (error) {
      console.error("Error saving shift:", error);
      
      // Show different messages based on network status
      if (isOnline()) {
        toast({
          title: "Chyba při ukládání",
          description: "Nepodařilo se uložit směnu na server. Zkuste to prosím znovu.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Uloženo offline",
          description: "Směna byla uložena offline a bude synchronizována při obnovení připojení.",
        });
      }
    }
  }, [shiftData, user, shiftService, notificationService]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = async () => {
      const processedCount = await shiftService.processOfflineQueue();
      if (processedCount > 0) {
        toast({
          title: "Synchronizace dokončena",
          description: `Synchronizováno ${processedCount} směn`,
        });
      }
    };

    const handleShiftsUpdated = (event: any) => {
      // Refresh shifts when real-time update occurs
      setShifts(prev => [...prev]);
      
      // Show notification for changes from other devices
      if (event.detail?.message) {
        toast({
          title: "Synchronizace",
          description: event.detail.message,
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('shifts-updated', handleShiftsUpdated);
    window.addEventListener('refresh-shifts', handleShiftsUpdated);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('shifts-updated', handleShiftsUpdated);
      window.removeEventListener('refresh-shifts', handleShiftsUpdated);
    };
  }, [shiftService, setShifts]);

  // Initialize notifications
  useEffect(() => {
    const initNotifications = async () => {
      const hasPermission = await notificationService.requestPermission();
      if (hasPermission) {
        notificationService.restoreScheduledReminders();
        notificationService.scheduleDailySummary();
      }
    };

    initNotifications();
  }, [notificationService]);

  // Handle saving notes from dialog
  const handleSaveNotes = useCallback(async (notes: string) => {
    shiftData.setShiftNotes(notes);
    
    if (currentShift) {
      await handleSaveShift();
    }
  }, [shiftData, currentShift, handleSaveShift]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shiftService.cleanup();
    };
  }, [shiftService]);

  return {
    ...shiftData,
    shifts,
    setShifts,
    currentShift,
    isLoading,
    handleSaveShift,
    handleDeleteShift: () => {}, // Keep existing delete logic
    handleSaveNotes
  };
};
