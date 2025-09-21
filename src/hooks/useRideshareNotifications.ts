import { useEffect, useRef, useCallback } from 'react';
import { useSupabaseNotifications } from './useSupabaseNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export const useRideshareNotifications = () => {
  const { addNotification } = useSupabaseNotifications();
  const { t } = useTranslation('notifications');
  const channelsRef = useRef<any[]>([]);
  const initialized = useRef(false);

  const cleanup = useCallback(() => {
    if (channelsRef.current.length > 0) {
      console.log('🧹 Cleaning up rideshare notification channels');
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    }
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    console.log('🔔 useRideshareNotifications: Setting up real-time listeners');
    
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

    // Subscribe to rideshare contacts changes (contact requests)
    const contactsChannel = supabase
      .channel('rideshare-contacts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'rideshare_contacts'
        },
        async (payload) => {
          console.log('🔔 Rideshare contact INSERT event triggered:', payload);
          
          if (payload.new) {
            try {
              // Get offer details to create meaningful notification
              const { data: offer, error: offerError } = await supabase
                .from('rideshare_offers')
                .select('*')
                .eq('id', payload.new.offer_id)
                .single();

              if (offerError) {
                console.error('❌ Error fetching offer details:', offerError);
                return;
              }

              if (offer) {
                console.log('📋 Creating notifications for contact:', {
                  offerId: offer.id,
                  driverId: offer.user_id,
                  requesterId: payload.new.requester_user_id
                });

                // Create notification for the driver (only if it's not the same user)
                if (offer.user_id && offer.user_id !== payload.new.requester_user_id) {
                  const driverNotification = {
                    user_id: offer.user_id,
                    title: 'Nová žádost o spolujízdu',
                    message: `Uživatel ${payload.new.requester_email?.split('@')[0] || 'někdo'} žádá o spolujízdu z ${offer.origin_address} do ${offer.destination_address} dne ${offer.departure_date} v ${offer.departure_time}`,
                    type: 'rideshare_match',
                    category: 'rideshare',
                    metadata: {
                      contact_id: payload.new.id,
                      offer_id: payload.new.offer_id,
                      requester_email: payload.new.requester_email,
                      requester_name: payload.new.requester_email?.split('@')[0] || 'Uživatel',
                      origin_address: offer.origin_address,
                      destination_address: offer.destination_address,
                      departure_date: offer.departure_date,
                      departure_time: offer.departure_time,
                      status: 'pending'
                    },
                    related_to: {
                      type: 'rideshare_contact',
                      id: payload.new.id
                    }
                  };

                  console.log('📤 Creating driver notification:', driverNotification);
                  
                  const { error: driverNotifError } = await supabase
                    .from('notifications')
                    .insert(driverNotification);

                  if (driverNotifError) {
                    console.error('❌ Error creating driver notification:', driverNotifError);
                  } else {
                    console.log('✅ Driver notification created successfully');
                  }
                }

                // Create confirmation notification for the requester
                if (payload.new.requester_user_id) {
                  const requesterNotification = {
                    user_id: payload.new.requester_user_id,
                    title: 'Žádost odeslána',
                    message: `Vaše žádost o spolujízdu z ${offer.origin_address} do ${offer.destination_address} čeká na schválení`,
                    type: 'rideshare_request',
                    category: 'rideshare',
                    metadata: {
                      contact_id: payload.new.id,
                      offer_id: payload.new.offer_id,
                      origin_address: offer.origin_address,
                      destination_address: offer.destination_address,
                      departure_date: offer.departure_date,
                      departure_time: offer.departure_time,
                      status: 'pending'
                    },
                    related_to: {
                      type: 'rideshare_contact',
                      id: payload.new.id
                    }
                  };

                  console.log('📤 Creating requester notification:', requesterNotification);
                  
                  const { error: requesterNotifError } = await supabase
                    .from('notifications')
                    .insert(requesterNotification);

                  if (requesterNotifError) {
                    console.error('❌ Error creating requester notification:', requesterNotifError);
                  } else {
                    console.log('✅ Requester notification created successfully');
                  }
                }
              }
            } catch (error) {
              console.error('❌ Error in rideshare contact listener:', error);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Rideshare contacts channel status:', status);
      });

    // Store channels for cleanup
    channelsRef.current = [offersChannel, requestsChannel, contactsChannel];

    return cleanup;
  }, [cleanup]);

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