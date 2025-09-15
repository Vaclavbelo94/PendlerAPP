import { useEffect } from 'react';
import { useSupabaseNotifications } from './useSupabaseNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export const useAdminNotifications = () => {
  const { addNotification } = useSupabaseNotifications();
  const { t } = useTranslation('notifications');

  useEffect(() => {
    // Subscribe to admin notifications
    const adminChannel = supabase
      .channel('admin-notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_notifications'
        },
        (payload) => {
          if (payload.new) {
            // This would be handled by the backend notification system
            // when admin creates a broadcast notification
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(adminChannel);
    };
  }, [addNotification, t]);

  // Function to create test admin notifications
  const createTestAdminNotification = async () => {
    await addNotification({
      title: t('admin.message'),
      message: 'Důležité: Nové směrnice pro správu směn vstupují v platnost od 1. ledna 2025. Všichni manažeři si prosím projděte dokumentaci.',
      type: 'admin_message',
      category: 'admin',
      metadata: {
        admin_type: 'message',
        priority: 'high',
        admin_user: 'Admin systému',
        target_company: 'dhl',
        action_required: true,
        expires_at: '2025-01-31T23:59:59Z'
      },
      related_to: {
        type: 'admin_message',
        id: 'admin-msg-' + Date.now()
      }
    });
  };

  const createTestAdminWarning = async () => {
    await addNotification({
      title: t('admin.warning'),
      message: 'Upozornění: Byla zjištěna neobvyklá aktivita v systému. Doporučujeme změnit hesla a zkontrolovat přístupová oprávnění.',
      type: 'admin_warning',
      category: 'admin',
      metadata: {
        admin_type: 'warning',
        priority: 'critical',
        admin_user: 'Bezpečnostní tým',
        action_required: true,
        affected_systems: ['Uživatelské účty', 'Přístupová oprávnění']
      },
      related_to: {
        type: 'admin_warning',
        id: 'security-warning-' + Date.now()
      }
    });
  };

  const createTestAdminAnnouncement = async () => {
    await addNotification({
      title: t('admin.announcement'),
      message: 'Oznámení: Spouštíme nový modul pro sledování carbon footprint. Funkce bude dostupná všem uživatelům od příštího týdne.',
      type: 'admin_announcement',
      category: 'admin',
      metadata: {
        admin_type: 'announcement',
        priority: 'medium',
        admin_user: 'Produktový tým',
        features: ['Carbon footprint tracker', 'Ekologické reporty', 'Srovnání dopravních prostředků']
      },
      related_to: {
        type: 'admin_announcement',
        id: 'carbon-feature-' + Date.now()
      }
    });
  };

  return {
    createTestAdminNotification,
    createTestAdminWarning,
    createTestAdminAnnouncement
  };
};