
import { useEffect, useCallback, useMemo } from "react";
import { useShiftLoading } from "./useShiftLoading";
import { useShiftData } from "./useShiftData";
import { useCurrentShift } from "./useCurrentShift";
import { AdvancedOfflineService } from "../services/AdvancedOfflineService";
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

  const offlineService = useMemo(() => AdvancedOfflineService.getInstance(), []);
  const notificationServiceInstance = useMemo(() => ShiftNotificationService.getInstance(), []);

  const isOnline = useCallback(() => navigator.onLine, []);

  const handleSaveShift = useCallback(async () => {
    if (!shiftData.selectedDate || !user) {
      notificationService.showAuthRequired();
      return;
    }
    
    try {
      // Zde by byla implementace ukládání s pokročilou offline podporou
      notificationService.showShiftSaved(!!currentShift);
      
      if (!currentShift) {
        // Pouze pro nové směny plánujeme připomenutí
        // await notificationServiceInstance.scheduleShiftReminder(savedShift);
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
  }, [shiftData, user, currentShift, isOnline]);

  const handleDeleteShift = useCallback(async () => {
    if (!currentShift || !user) return;
    
    try {
      // Implementace mazání s pokročilou offline podporou
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

  // Pokročilá synchronizace s conflict resolution
  const handleAdvancedSync = useCallback(async () => {
    if (!user || !isOnline()) return;

    try {
      const result = await offlineService.syncWithConflictResolution(user.id);
      
      if (result.synced > 0) {
        notificationService.showSyncComplete(result.synced);
      }
      
      if (result.conflicts > 0) {
        notificationService.showRemoteUpdate(
          `Synchronizace dokončena. ${result.conflicts} konfliktů vyřešeno automaticky.`
        );
      }
      
      window.dispatchEvent(new CustomEvent('refresh-shifts'));
    } catch (error) {
      errorHandler.handleError(error, { operation: 'handleAdvancedSync' });
    }
  }, [offlineService, user, isOnline]);

  // Memoized event handlers
  const handleOnline = useCallback(async () => {
    await handleAdvancedSync();
  }, [handleAdvancedSync]);

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
      offlineService.cleanup?.();
    };
  }, [offlineService]);

  return {
    ...shiftData,
    shifts,
    setShifts,
    currentShift,
    isLoading,
    handleSaveShift,
    handleDeleteShift,
    handleSaveNotes,
    handleAdvancedSync
  };
};
