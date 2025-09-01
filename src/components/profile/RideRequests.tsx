import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, MessageCircle, Calendar, Clock, CheckCircle, AlertCircle, XCircle, MapPin, User, Euro, Phone, RefreshCw } from 'lucide-react';
import { fixedRideshareService } from '@/services/fixedRideshareService';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { formatDate } from '@/utils/enhancedCountryUtils';
import { formatCurrencyWithSymbol } from '@/utils/currencyUtils';
import { supabase } from '@/integrations/supabase/client';

interface RideRequest {
  id: string;
  offer_id: string; // Changed from rideshare_offer_id to match rideshare_contacts table
  requester_user_id: string;
  message: string;
  requester_email?: string;
  phone_number?: string; // Changed from requester_phone to match rideshare_contacts table
  country_code?: string; // Changed from requester_country_code to match rideshare_contacts table
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  rideshare_offers?: {
    origin_address: string;
    destination_address: string;
    departure_date: string;
    departure_time: string;
    seats_available: number;
    price_per_person: number;
    currency: string;
    user_id: string; // This is the driver's user_id
  };
}

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  accepted: <CheckCircle className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />
};

const statusColors = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  accepted: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20'
};

export const RideRequests = () => {
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RideRequest | null>(null);
  const { toast } = useToast();
  const { t, i18n } = useTranslation(['profile', 'travel']);
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    console.log('🎯 RideRequests component mounted/updated:', {
      user: user?.email,
      authLoading,
      hasUser: !!user
    });
    
    // Wait for auth to finish loading
    if (authLoading) {
      console.log('⏳ Auth still loading, waiting...');
      return;
    }
    
    if (user) {
      console.log('✅ User available, fetching ride requests for:', user.email);
      fetchRideRequests();
    } else {
      console.log('❌ No user found after auth loading completed');
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchRideRequests = async () => {
    try {
      if (!user) {
        console.log('❌ No user available for fetching ride requests');
        return;
      }
      
      console.log('🔍 Fetching ride requests for user:', user.id, 'email:', user.email);
      setLoading(true);

      // Test direct Supabase query for debugging
      console.log('🧪 Testing direct Supabase query...');
      const { data: directTest, error: directError } = await supabase
        .from('rideshare_contacts')
        .select(`
          *,
          rideshare_offers(*)
        `)
        .limit(5);
      
      console.log('🧪 Direct query test result:', {
        directError,
        directTestCount: directTest?.length || 0,
        directTest: directTest?.slice(0, 2)
      });

      const requests = await fixedRideshareService.getUserRideRequests(user.id);
      console.log('📋 Final fetched ride requests:', {
        count: requests?.length || 0,
        requests: requests?.slice(0, 2)
      });
      setRequests(requests as RideRequest[]);
    } catch (error) {
      console.error('❌ Error fetching ride requests:', error);
      toast({
        title: t('profile:error'),
        description: t('profile:rideRequestsError'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return t('profile:statusPending');
      case 'accepted':
        return t('profile:statusAccepted');
      case 'rejected':
        return t('profile:statusRejected');
      default:
        return status;
    }
  };

  const formatDateLocal = (dateString: string) => {
    return formatDate(dateString, i18n.language);
  };

  const formatPrice = (price: number, currency: string = 'EUR') => {
    if (!price || price === 0) return t('travel:free');
    return formatCurrencyWithSymbol(price);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {t('profile:rideRequests')}
          </h2>
          <div className="animate-spin">
            <RefreshCw className="h-4 w-4" />
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              {t('profile:loading')}...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {t('profile:rideRequests')} ({requests.length})
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchRideRequests}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          {t('profile:refresh')}
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">{t('profile:noRideRequests')}</p>
              <p className="text-sm mt-2">
                {t('profile:noRideRequestsDesc')}
              </p>
              <p className="text-xs mt-3 bg-muted/50 p-3 rounded-lg">
                💡 {t('profile:rideRequestsHint')}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline" className={statusColors[request.status]}>
                        <span className="flex items-center gap-1">
                          {statusIcons[request.status]}
                          {getStatusLabel(request.status)}
                        </span>
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDateLocal(request.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                        className="ml-2 flex-shrink-0"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {t('profile:detail')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto mx-4">
                      <DialogHeader>
                        <DialogTitle>{t('profile:rideRequestDetail')}</DialogTitle>
                      </DialogHeader>
                      
                      {selectedRequest && (
                        <div className="space-y-4">
                          {/* Status */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t('profile:status')}:</span>
                            <Badge variant="outline" className={statusColors[selectedRequest.status]}>
                              <span className="flex items-center gap-1">
                                {statusIcons[selectedRequest.status]}
                                {getStatusLabel(selectedRequest.status)}
                              </span>
                            </Badge>
                          </div>

                          {/* Trasa */}
                          {selectedRequest.rideshare_offers && (
                            <div className="space-y-3">
                              <h4 className="font-medium text-sm">{t('travel:route')}</h4>
                              <div className="bg-muted/30 rounded-lg p-3 space-y-3">
                                <div className="flex items-start gap-2">
                                  <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0"></div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-medium text-success mb-1">{t('travel:from')}</div>
                                    <div className="text-sm break-words">
                                      {selectedRequest.rideshare_offers.origin_address}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                  <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0"></div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-medium text-destructive mb-1">{t('travel:to')}</div>
                                    <div className="text-sm break-words">
                                      {selectedRequest.rideshare_offers.destination_address}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-3 text-xs pt-2 border-t border-border/20">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDateLocal(selectedRequest.rideshare_offers.departure_date)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {selectedRequest.rideshare_offers.departure_time}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Euro className="h-3 w-3" />
                                    {formatPrice(selectedRequest.rideshare_offers.price_per_person, selectedRequest.rideshare_offers.currency)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Zpráva */}
                          <div>
                            <h4 className="font-medium text-sm mb-2">{t('profile:yourMessage')}</h4>
                            <div className="bg-muted/20 p-3 rounded-lg text-sm">
                              {selectedRequest.message}
                            </div>
                          </div>

                           {/* Kontaktní údaje */}
                           {(selectedRequest.requester_email || selectedRequest.phone_number) && (
                             <div>
                               <h4 className="font-medium text-sm mb-2">{t('profile:contactDetails')}</h4>
                               <div className="text-sm space-y-2">
                                 {selectedRequest.requester_email && (
                                   <div className="flex items-center gap-2">
                                     <User className="h-4 w-4 text-muted-foreground" />
                                     <span className="font-medium">Email:</span>
                                     <span className="break-all">{selectedRequest.requester_email}</span>
                                   </div>
                                 )}
                                 {selectedRequest.phone_number && (
                                   <div className="flex items-center gap-2">
                                     <Phone className="h-4 w-4 text-muted-foreground" />
                                     <span className="font-medium">{t('profile:phone')}:</span>
                                     <span>
                                       {selectedRequest.country_code && (
                                         <span>{selectedRequest.country_code} </span>
                                       )}
                                       {selectedRequest.phone_number}
                                     </span>
                                   </div>
                                 )}
                               </div>
                             </div>
                           )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* Quick route info for mobile */}
                {request.rideshare_offers && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-success font-medium">{t('travel:from')}</div>
                        <div className="text-sm font-medium break-words">
                          {request.rideshare_offers.origin_address}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-destructive font-medium">{t('travel:to')}</div>
                        <div className="text-sm font-medium break-words">
                          {request.rideshare_offers.destination_address}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2 pt-2 border-t border-border/20">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateLocal(request.rideshare_offers.departure_date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {request.rideshare_offers.departure_time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Euro className="h-3 w-3" />
                        {formatPrice(request.rideshare_offers.price_per_person, request.rideshare_offers.currency)}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RideRequests;