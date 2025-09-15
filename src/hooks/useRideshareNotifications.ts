import { useEffect } from 'react';
import { useSupabaseNotifications } from './useSupabaseNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export const useRideshareNotifications = () => {
  const { addNotification } = useSupabaseNotifications();
  const { t } = useTranslation('notifications');

  useEffect(() => {
    // Subscribe to rideshare offers changes
    const offersChannel = supabase
      .channel('rideshare-offers-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'rideshare_offers'
        },
        (payload) => {
          if (payload.new) {
            addNotification({
              title: t('rideshare.newOffer'),
              message: `Nová nabídka spolujízdy z ${payload.new.origin_address} do ${payload.new.destination_address}`,
              type: 'rideshare_offer',
              category: 'rideshare',
              metadata: {
                offer_id: payload.new.id,
                origin_address: payload.new.origin_address,
                destination_address: payload.new.destination_address,
                departure_time: payload.new.departure_time,
                seats_available: payload.new.seats_available,
                price_per_person: payload.new.price_per_person
              },
              related_to: {
                type: 'rideshare_offer',
                id: payload.new.id
              }
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rideshare_offers'
        },
        (payload) => {
          if (payload.new && payload.old) {
            // Check if offer was cancelled
            if (!payload.old.is_active && payload.new.is_active === false) {
              addNotification({
                title: t('rideshare.offerCancelled'),
                message: `Nabídka spolujízdy byla zrušena`,
                type: 'rideshare_cancelled',
                category: 'rideshare',
                metadata: {
                  offer_id: payload.new.id,
                  origin_address: payload.new.origin_address,
                  destination_address: payload.new.destination_address
                },
                related_to: {
                  type: 'rideshare_offer',
                  id: payload.new.id
                }
              });
            }
          }
        }
      )
      .subscribe();

    // Subscribe to rideshare requests changes
    const requestsChannel = supabase
      .channel('rideshare-requests-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'rideshare_requests'
        },
        (payload) => {
          if (payload.new) {
            addNotification({
              title: t('rideshare.newRequest'),
              message: `Nová žádost o spolujízdu z ${payload.new.origin_address} do ${payload.new.destination_address}`,
              type: 'rideshare_request',
              category: 'rideshare',
              metadata: {
                request_id: payload.new.id,
                origin_address: payload.new.origin_address,
                destination_address: payload.new.destination_address,
                departure_time_from: payload.new.departure_time_from,
                departure_time_to: payload.new.departure_time_to,
                max_price_per_person: payload.new.max_price_per_person
              },
              related_to: {
                type: 'rideshare_request',
                id: payload.new.id
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(offersChannel);
      supabase.removeChannel(requestsChannel);
    };
  }, [addNotification, t]);

  // Function to create test rideshare notifications
  const createTestRideshareNotification = async () => {
    await addNotification({
      title: t('rideshare.newOffer'),
      message: 'Nová nabídka spolujízdy Praha → Brno, zítra v 14:00',
      type: 'rideshare_offer',
      category: 'rideshare',
      metadata: {
        origin_address: 'Praha, Česká republika',
        destination_address: 'Brno, Česká republika',
        departure_time: '14:00',
        seats_available: 3,
        price_per_person: 250,
        status: 'active'
      },
      related_to: {
        type: 'rideshare_offer',
        id: 'test-offer-1'
      }
    });
  };

  return {
    createTestRideshareNotification
  };
};