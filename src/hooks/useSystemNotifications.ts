import { useEffect } from 'react';
import { useSupabaseNotifications } from './useSupabaseNotifications';
import { useTranslation } from 'react-i18next';

export const useSystemNotifications = () => {
  const { addNotification } = useSupabaseNotifications();
  const { t } = useTranslation('notifications');

  useEffect(() => {
    // Check for system maintenance windows (example logic)
    const checkSystemStatus = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Example: Maintenance window between 2-4 AM
      if (hour >= 2 && hour < 4) {
        // This would typically come from a system config or external service
        // For demo purposes, we'll simulate it
      }
    };

    // Check system status periodically
    const interval = setInterval(checkSystemStatus, 5 * 60 * 1000); // Every 5 minutes

    return () => {
      clearInterval(interval);
    };
  }, [addNotification, t]);

  // Function to create test system notifications
  const createTestSystemNotification = async () => {
    await addNotification({
      title: t('system.maintenance'),
      message: 'Plánovaná údržba systému dnes od 02:00 do 04:00. Některé funkce mohou být dočasně nedostupné.',
      type: 'system_maintenance',
      category: 'system',
      metadata: {
        system_type: 'maintenance',
        maintenance_window: '02:00 - 04:00',
        affected_services: ['Správa směn', 'Spolujízdy', 'Reporty'],
        severity: 'medium'
      },
      related_to: {
        type: 'system_maintenance',
        id: 'maintenance-' + Date.now()
      }
    });
  };

  const createTestUpdateNotification = async () => {
    await addNotification({
      title: t('system.update'),
      message: 'Aplikace byla aktualizována na verzi 2.1.0. Přidali jsme nové funkce pro správu spolujízd a vylepšili výkon.',
      type: 'system_update',
      category: 'system',
      metadata: {
        system_type: 'update',
        version: '2.1.0',
        severity: 'low',
        features: ['Nové filtry pro spolujízdy', 'Vylepšený export reportů', 'Opravy chyb']
      },
      related_to: {
        type: 'system_update',
        id: 'update-2.1.0'
      }
    });
  };

  const createTestAnnouncementNotification = async () => {
    await addNotification({
      title: t('system.announcement'),
      message: 'Vánoční provoz: Aplikace bude v omezeném režimu od 24.12. do 2.1. Přejeme příjemné svátky!',
      type: 'system_announcement',
      category: 'system',
      metadata: {
        system_type: 'announcement',
        severity: 'low',
        expires_at: '2025-01-02T23:59:59Z'
      },
      related_to: {
        type: 'system_announcement',
        id: 'christmas-2024'
      }
    });
  };

  return {
    createTestSystemNotification,
    createTestUpdateNotification,
    createTestAnnouncementNotification
  };
};