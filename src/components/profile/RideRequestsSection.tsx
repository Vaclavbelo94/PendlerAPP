import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Phone, MapPin, Calendar, Clock, Users, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/auth';
import { rideshareService } from '@/services/rideshareService';
import { formatPhoneNumber, getDriverDisplayName } from '@/utils/countryUtils';

interface RideRequest {
  id: string;
  offer_id: string;
  requester_user_id: string;
  message: string;
  requester_email?: string;
  requester_phone?: string;
  status: string;
  created_at: string;
  updated_at: string;
  rideshare_offers: {
    origin_address: string;
    destination_address: string;
    departure_date: string;
    departure_time: string;
    seats_available: number;
    price_per_person: number;
    currency: string;
    user_id: string;
  };
}

const RideRequestsSection = () => {
  const { t } = useTranslation('profile');
  const { user } = useAuth();
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadRideRequests();
    }
  }, [user]);

  const loadRideRequests = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await rideshareService.getDriverContacts(user.id);
      setRequests(data);
    } catch (error) {
      console.error('Error loading ride requests:', error);
      toast({
        title: t('error'),
        description: 'Chyba při načítání žádostí',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, status: string) => {
    try {
      await rideshareService.updateContactStatus(requestId, status);
      toast({
        title: t('success'),
        description: t('requestUpdated'),
      });
      // Reload requests to get updated data
      await loadRideRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: t('error'),
        description: 'Chyba při aktualizaci žádosti',
        variant: 'destructive'
      });
    }
  };

  const handleCall = (phoneNumber: string, countryCode: string) => {
    if (phoneNumber) {
      const fullNumber = `${countryCode}${phoneNumber}`;
      window.location.href = `tel:${fullNumber}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('cs-CZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('cs-CZ', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {t('rideRequests')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse">Načítání...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {t('rideRequests')}
        </CardTitle>
        <CardDescription>
          {requests.length > 0 
            ? `${requests.length} ${requests.length === 1 ? 'žádost' : requests.length < 5 ? 'žádosti' : 'žádostí'}`
            : t('manageRideRequests')
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">{t('noRideRequests')}</p>
            <p className="text-sm">{t('rideRequestsWillAppearHere')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 space-y-3">
                {/* Request Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{t('requestFrom')}</h4>
                      <Badge className={getStatusColor(request.status)}>
                        {t(request.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('requestedAt')}: {formatDateTime(request.created_at)}
                    </p>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">{formatDate(request.rideshare_offers.departure_date)}</span>
                    <Clock className="h-4 w-4 text-primary ml-2" />
                    <span className="font-medium">{request.rideshare_offers.departure_time}</span>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3 w-3 text-green-500 mt-0.5" />
                      <span className="text-muted-foreground">{request.rideshare_offers.origin_address}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3 w-3 text-red-500 mt-0.5" />
                      <span className="text-muted-foreground">{request.rideshare_offers.destination_address}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{request.rideshare_offers.seats_available} míst</span>
                    {request.rideshare_offers.price_per_person > 0 && (
                      <>
                        <span>•</span>
                        <span>{request.rideshare_offers.price_per_person} {request.rideshare_offers.currency}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">{t('requestMessage')}:</h5>
                  <p className="text-sm bg-muted/50 rounded p-2">{request.message}</p>
                </div>

                 {/* Contact Info */}
                {(request.requester_email || request.requester_phone) && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">{t('contactInfo')}:</h5>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {request.requester_email && (
                        <span className="bg-muted/50 rounded px-2 py-1">
                          📧 {request.requester_email}
                        </span>
                      )}
                      {request.requester_phone && (
                        <span className="bg-muted/50 rounded px-2 py-1">
                          📞 {request.requester_phone}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {request.requester_phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCall(request.requester_phone!, '+420')}
                      className="flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      {t('callRequester')}
                    </Button>
                  )}
                  
                  {request.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(request.id, 'accepted')}
                        className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4" />
                        {t('accept')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                        className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                        {t('reject')}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RideRequestsSection;