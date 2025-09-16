import React, { useState } from 'react';
import { Car, MapPin, Clock, User, CheckCircle, AlertCircle, XCircle, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { SupabaseNotification } from '@/hooks/useSupabaseNotifications';
import { supabase } from '@/integrations/supabase/client';
import { rideshareContactService } from '@/services/rideshareContactService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RideshareNotificationItemProps {
  notification: SupabaseNotification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const RideshareNotificationItem: React.FC<RideshareNotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete
}) => {
  const { t, i18n } = useTranslation('notifications');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Extract rideshare info from metadata
  const origin = notification.metadata?.origin_address || '';
  const destination = notification.metadata?.destination_address || '';
  const departureTime = notification.metadata?.departure_time || '';
  const seatsAvailable = notification.metadata?.seats_available || '';
  const pricePerPerson = notification.metadata?.price_per_person || '';
  const requestStatus = notification.metadata?.status || '';
  
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Car className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return t('status.approved');
      case 'accepted':
        return t('status.approved');
      case 'rejected':
        return t('status.rejected');
      case 'cancelled':
        return t('status.rejected');
      case 'pending':
        return t('status.pending');
      case 'processed':
        return t('status.processed');
      default:
        return status || t('status.pending');
    }
  };

  const isPendingStatus = (status?: string) => {
    return !status || status.toLowerCase() === 'pending';
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:MM format
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('time.now');
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} h`;
    return `${Math.floor(diffInMinutes / 1440)} d`;
  };

  const getRideshareTypeLabel = () => {
    const type = notification.type?.toLowerCase();
    if (type?.includes('contact')) {
      return t('rideshare.contactRequest');
    }
    if (type?.includes('request_sent')) {
      return t('rideshare.requestSent');
    }
    if (type?.includes('request')) {
      return t('rideshare.newRequest');
    }
    if (type?.includes('offer')) {
      return t('rideshare.newOffer');
    }
    if (type?.includes('accepted')) {
      return t('rideshare.requestAccepted');
    }
    if (type?.includes('rejected')) {
      return t('rideshare.requestRejected');
    }
    if (type?.includes('cancelled')) {
      return t('rideshare.requestCancelled');
    }
    return notification.title;
  };

  const handleAcceptRequest = async () => {
    if (!notification.metadata?.contact_id) {
      console.error('❌ Missing contact_id in metadata:', notification.metadata);
      toast.error('Chybí ID kontaktu');
      return;
    }
    
    console.log('🚀 Starting approval process for contact:', notification.metadata.contact_id);
    console.log('📝 Notification metadata:', notification.metadata);
    
    setIsProcessing(true);
    try {
      console.log('⏳ Step 1: Updating contact status...');
      
      // Use enhanced service to update contact status and seats
      const updatedContact = await rideshareContactService.updateContactStatus(
        notification.metadata.contact_id,
        'accepted'
      );
      
      console.log('✅ Step 1 completed - Contact updated:', updatedContact);

      console.log('⏳ Step 2: Creating notification for requester...');
      
      // Create notification for requester
      if (notification.metadata.requester_user_id) {
        const notificationResult = await supabase.from('notifications').insert({
          user_id: notification.metadata.requester_user_id,
          title: t('rideshare.requestAccepted'),
          message: t('rideshare.requestAccepted'),
          type: 'rideshare_accepted',
          category: 'rideshare',
          priority: 'high',
          language: 'cs',
          metadata: {
            contact_id: notification.metadata.contact_id,
            offer_id: notification.metadata.offer_id,
            origin_address: notification.metadata.origin_address,
            destination_address: notification.metadata.destination_address,
            departure_time: notification.metadata.departure_time,
            status: 'approved'
          }
        });
        
        if (notificationResult.error) {
          console.error('❌ Step 2 failed - Notification creation error:', notificationResult.error);
          throw new Error(`Failed to create notification: ${notificationResult.error.message}`);
        }
        
        console.log('✅ Step 2 completed - Notification created');
      } else {
        console.log('ℹ️ Step 2 skipped - No requester_user_id');
      }

      console.log('⏳ Step 3: Updating notification status...');
      
      // Mark notification as processed
      const updateResult = await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          updated_at: new Date().toISOString(),
          metadata: {
            ...notification.metadata,
            status: 'processed',
            processed_at: new Date().toISOString()
          }
        })
        .eq('id', notification.id);

      if (updateResult.error) {
        console.error('❌ Step 3 failed - Notification update error:', updateResult.error);
        throw new Error(`Failed to update notification: ${updateResult.error.message}`);
      }
      
      console.log('✅ Step 3 completed - Notification updated');
      console.log('🎉 All steps completed successfully!');

      toast.success(t('rideshare.requestAccepted'));
      if (onMarkAsRead) onMarkAsRead(notification.id);
    } catch (error) {
      console.error('💥 DETAILED ERROR in handleAcceptRequest:', error);
      console.error('💥 Error stack:', error.stack);
      console.error('💥 Error message:', error.message);
      toast.error(`Chyba při přijímání žádosti: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!notification.metadata?.contact_id) return;
    
    setIsProcessing(true);
    try {
      // Use enhanced service to update contact status
      await rideshareContactService.updateContactStatus(
        notification.metadata.contact_id,
        'rejected'
      );

      // Create notification for requester
      if (notification.metadata.requester_user_id) {
        await supabase.from('notifications').insert({
          user_id: notification.metadata.requester_user_id,
          title: t('rideshare.requestRejected'),
          message: t('rideshare.requestRejected'),
          type: 'rideshare_rejected',
          category: 'rideshare',
          priority: 'medium',
          language: 'cs',
          metadata: {
            contact_id: notification.metadata.contact_id,
            offer_id: notification.metadata.offer_id,
            origin_address: notification.metadata.origin_address,
            destination_address: notification.metadata.destination_address,
            departure_time: notification.metadata.departure_time,
            status: 'rejected'
          }
        });
      }

      // Mark notification as processed
      await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          updated_at: new Date().toISOString(),
          metadata: {
            ...notification.metadata,
            status: 'processed',
            processed_at: new Date().toISOString()
          }
        })
        .eq('id', notification.id);

      toast.info(t('rideshare.requestRejected'));
      if (onMarkAsRead) onMarkAsRead(notification.id);
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Chyba při zamítání žádosti');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      !notification.read && "ring-2 ring-primary/20 bg-primary/5"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <Car className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium text-foreground">
                  {getRideshareTypeLabel()}
                </h4>
              </div>
              
              {!notification.read && (
                <Badge variant="default" className="h-5 text-xs">
                  {t('status.unread')}
                </Badge>
              )}
              
              {requestStatus && (
                <Badge 
                  variant="outline" 
                  className={cn("h-5 text-xs border flex items-center gap-1", getStatusColor(requestStatus))}
                >
                  {getStatusIcon(requestStatus)}
                  {getStatusText(requestStatus)}
                </Badge>
              )}
            </div>

            {/* Rideshare Details */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {notification.message}
              </p>
              
              {/* Route Information */}
              {(origin || destination) && (
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                  {origin && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-muted-foreground">Z:</span>
                      <span className="font-medium truncate">{origin}</span>
                    </div>
                  )}
                  
                  {destination && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span className="text-muted-foreground">Do:</span>
                      <span className="font-medium truncate">{destination}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Trip Details */}
              {(departureTime || seatsAvailable || pricePerPerson) && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  {departureTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(departureTime)}</span>
                    </div>
                  )}
                  
                  {seatsAvailable && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{seatsAvailable} míst</span>
                    </div>
                  )}
                  
                  {pricePerPerson && (
                    <Badge variant="secondary" className="h-5 text-xs">
                      {pricePerPerson} EUR
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(notification.created_at)}
              </span>
              
              <div className="flex items-center gap-2">
                {/* Contact request actions for drivers */}
                {((notification.type === 'rideshare_contact' || notification.type === 'rideshare_match') && 
                  notification.metadata?.contact_id && 
                  isPendingStatus(notification.metadata?.status)) && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAcceptRequest}
                      disabled={isProcessing}
                      className="h-8 px-3 text-xs font-medium text-green-700 hover:text-green-800 border-green-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                    >
                      <Check className="h-3 w-3 mr-1.5" />
                      {t('rideshare.approve')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRejectRequest}
                      disabled={isProcessing}
                      className="h-8 px-3 text-xs font-medium text-red-700 hover:text-red-800 border-red-200 hover:border-red-300 hover:bg-red-50 transition-colors"
                    >
                      <X className="h-3 w-3 mr-1.5" />
                      {t('rideshare.reject')}
                    </Button>
                  </div>
                )}

                {!notification.read && onMarkAsRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="h-7 px-2 text-xs"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {t('actions.markAsRead')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};