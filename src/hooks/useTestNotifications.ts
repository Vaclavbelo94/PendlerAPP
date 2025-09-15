import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useTestNotifications = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { t } = useTranslation('toast');

  const createTestShiftNotification = async () => {
    setIsCreating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('daily-shift-notifications', {
        body: { 
          test: true,
          force: true // Force create notifications even if they already exist
        }
      });

      if (error) {
        console.error('Error creating test notifications:', error);
        toast.error(t('errors.createTestError'));
        return;
      }

      console.log('Test notifications created:', data);
      toast.success(t('test.testNotificationCreated', { count: data.created || 0 }));
      
      return data;
    } catch (error) {
      console.error('Error calling daily-shift-notifications function:', error);
      toast.error(t('errors.functionCallError'));
    } finally {
      setIsCreating(false);
    }
  };

  const createSampleShiftNotification = async (userId?: string) => {
    setIsCreating(true);
    
    try {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser) {
        toast.error(t('errors.notLoggedIn'));
        return;
      }

      const targetUserId = userId || currentUser.id;
      
      // Create a sample shift notification for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDateStr = tomorrow.toISOString().split('T')[0];

      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: targetUserId,
          title: t('test.sampleNotificationTitle'),
          message: t('test.sampleNotificationMessage'),
          type: 'shift_reminder',
          category: 'shift',
          priority: 'medium',
          language: 'cs',
          related_to: {
            type: 'shift',
            shift_id: 'test-shift-tomorrow',
            shift_date: tomorrowDateStr,
            shift_time: '22:00'
          },
          metadata: {
            shift_type: 'night',
            start_time: '22:00:00',
            end_time: '06:00:00',
            auto_generated: false,
            created_by: 'manual-test'
          }
        });

      if (error) {
        console.error('Error creating sample notification:', error);
        toast.error(t('errors.createSampleError'));
        return;
      }

      toast.success(t('test.sampleNotificationCreated'));
    } catch (error) {
      console.error('Error creating sample notification:', error);
      toast.error(t('errors.createSampleError'));
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createTestShiftNotification,
    createSampleShiftNotification,
    isCreating
  };
};