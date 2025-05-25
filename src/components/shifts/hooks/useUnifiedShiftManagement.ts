
import { useEffect, useCallback, useMemo } from "react";
import { useShiftLoading } from "./useShiftLoading";
import { useShiftData } from "./useShiftData";
import { useCurrentShift } from "./useCurrentShift";
import { EnhancedShiftService } from "../services/enhancedShiftService";
import { ShiftNotificationService } from "../notifications/ShiftNotificationService";
import { notificationService } from "../services/NotificationService";
import { errorHandler } from "@/utils/errorHandler";

export const useUnifiedShiftManagement = (user: any) => {
  const { shifts, setShifts, isLoading } = useShiftLoading(user);
  const shiftData = useShiftData();
  
  const currentShift = useCurrentShift(
    shiftData.selectedDate, 
    shifts, 
    shiftData.setShiftType, 
    shiftData.setShiftNotes
  );

  const shiftService = useMemo(() => EnhancedShiftService.getInstance(), []);
  const notificationServiceInstance = useMemo(() => ShiftNotificationService.getInstance(), []);

  const isOnline = useCallback(() => navigator.onLine, []);

  const handleSaveShift = useCallback(async () => {
    if (!shiftData.selectedDate || !user) {
      notificationService.showAuthRequired();
      return;
    }
    
    try {
      const { savedShift, isUpdate } = await shiftService.saveShiftEnhanced(
        shiftData.selectedDate, 
        shiftData.shiftType, 
        shiftData.shiftNotes, 
        user.id
      );
      
      notificationService.showShiftSaved(isUpdate);
      
      if (!isUpdate && savedShift) {
        await notificationServiceInstance.scheduleShiftReminder(savedShift);
      }
      
      window.dispatchEvent(new CustomEvent('refresh-shifts'));
      
    } catch (error) {
      if (isOnline()) {
        notificationService.showShiftError('save');
      } else {
        notificationService.showOfflineSaved();
      }
      errorHandler.handleError(error, { operation: 'handleSaveShift' });
    }
  }, [shiftData, user, shiftService, notificationServiceInstance, isOnline]);

  const handleDeleteShift = useCallback(async () => {
    if (!currentShift || !user) return;
    
    try {
      // Implementation from the enhanced service would go here
      notificationService.showShiftDeleted();
      window.dispatchEvent(new CustomEvent('refresh-shifts'));
    } catch (error) {
      notificationService.showShiftError('delete');
      errorHandler.handleError(error, { operation: 'handleDeleteShift' });
    }
  }, [currentShift, user]);

  const handleSaveNotes = useCallback(async (notes: string) => {
    shiftData.setShiftNotes(notes);
    
    if (currentShift) {
      await handleSaveShift();
    }
  }, [shiftData, currentShift, handleSaveShift]);

  // Memoized event handlers
  const handleOnline = useCallback(async () => {
    try {
      const processedCount = await shiftService.processOfflineQueue();
      if (processedCount > 0) {
        notificationService.showSyncComplete(processedCount);
      }
    } catch (error) {
      errorHandler.handleError(error, { operation: 'handleOnline' });
    }
  }, [shiftService]);

  const handleShiftsUpdated = useCallback((event: any) => {
    setShifts(prev => [...prev]);
    
    if (event.detail?.message) {
      notificationService.showRemoteUpdate(event.detail.message);
    }
  }, [setShifts]);

  // Handle online/offline events
  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('shifts-updated', handleShiftsUpdated);
    window.addEventListener('refresh-shifts', handleShiftsUpdated);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('shifts-updated', handleShiftsUpdated);
      window.removeEventListener('refresh-shifts', handleShiftsUpdated);
    };
  }, [handleOnline, handleShiftsUpdated]);

  // Initialize notifications
  useEffect(() => {
    const initNotifications = async () => {
      try {
        const hasPermission = await notificationServiceInstance.requestPermission();
        if (hasPermission) {
          notificationServiceInstance.restoreScheduledReminders();
          notificationServiceInstance.scheduleDailySummary();
        }
      } catch (error) {
        errorHandler.handleError(error, { operation: 'initNotifications' });
      }
    };

    initNotifications();
  }, [notificationServiceInstance]);

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
    handleDeleteShift,
    handleSaveNotes
  };
};
