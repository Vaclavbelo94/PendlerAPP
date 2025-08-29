import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, MessageCircle, Calendar, Clock, CheckCircle, AlertCircle, XCircle, MapPin, User, Euro, Phone } from 'lucide-react';
import { rideshareService } from '@/services/rideshareService';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { formatDate } from '@/utils/enhancedCountryUtils';
import { formatCurrencyWithSymbol } from '@/utils/currencyUtils';

interface RideRequest {
  id: string;
  rideshare_offer_id: string;
  requester_user_id: string;
  driver_user_id: string;
  message: string;
  requester_email?: string;
  requester_phone?: string;
  requester_country_code?: string;
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
  };
}

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  accepted: <CheckCircle className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
};

export const RideRequests = () => {
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RideRequest | null>(null);
  const { toast } = useToast();
  const { t, i18n } = useTranslation('travel');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRideRequests();
    }
  }, [user]);

  const fetchRideRequests = async () => {
    try {
      if (!user) return;
      
      const requests = await rideshareService.getUserRideRequests(user.id);
      setRequests(requests as RideRequest[]);
    } catch (error) {
      console.error('Error fetching ride requests:', error);
      toast({
        title: t('error'),
        description: 'Nepodařilo se načíst žádosti o spolujízdu',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Čeká na odpověď';
      case 'accepted':
        return 'Přijato';
      case 'rejected':
        return 'Zamítnuto';
      default:
        return status;
    }
  };

  const formatDateLocal = (dateString: string) => {
    return formatDate(dateString, i18n.language);
  };

  const formatPrice = (price: number, currency: string = 'EUR') => {
    if (!price || price === 0) return t('free');
    return formatCurrencyWithSymbol(price);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Moje žádosti o spolujízdu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Načítání...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Moje žádosti o spolujízdu ({requests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Zatím jste neposlali žádnou žádost o spolujízdu.</p>
            <p className="text-sm mt-2">
              Navštivte sekci Cestování a kontaktujte řidiče u nabídek, které vás zajímají.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={statusColors[request.status]}>
                        <span className="flex items-center gap-1">
                          {statusIcons[request.status]}
                          {getStatusLabel(request.status)}
                        </span>
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDateLocal(request.created_at)}
                      </span>
                    </div>
                    
                    {request.rideshare_offers && (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs text-green-600 font-medium">{t('from')}</div>
                            <div className="text-sm font-medium break-words">
                              {request.rideshare_offers.origin_address}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs text-red-600 font-medium">{t('to')}</div>
                            <div className="text-sm font-medium break-words">
                              {request.rideshare_offers.destination_address}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
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
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Detail žádosti o spolujízdu</DialogTitle>
                      </DialogHeader>
                      
                      {selectedRequest && (
                        <div className="space-y-6">
                          {/* Status a datum */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Status</h4>
                              <Badge className={statusColors[selectedRequest.status]}>
                                <span className="flex items-center gap-1">
                                  {statusIcons[selectedRequest.status]}
                                  {getStatusLabel(selectedRequest.status)}
                                </span>
                              </Badge>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Odesláno</h4>
                              <span className="text-sm">{formatDateLocal(selectedRequest.created_at)}</span>
                            </div>
                          </div>

                          {/* Trasa */}
                          {selectedRequest.rideshare_offers && (
                            <div>
                              <h4 className="font-semibold mb-3">Trasa</h4>
                              <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                                <div className="flex items-start gap-2">
                                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-medium text-green-600 mb-1">{t('from')}</div>
                                    <div className="text-sm text-foreground break-words">
                                      {selectedRequest.rideshare_offers.origin_address}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                  <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-medium text-red-600 mb-1">{t('to')}</div>
                                    <div className="text-sm text-foreground break-words">
                                      {selectedRequest.rideshare_offers.destination_address}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-4 pt-2 border-t border-border/20">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">
                                      {formatDateLocal(selectedRequest.rideshare_offers.departure_date)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-accent-foreground" />
                                    <span className="text-sm font-medium">
                                      {selectedRequest.rideshare_offers.departure_time}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Euro className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">
                                      {formatPrice(selectedRequest.rideshare_offers.price_per_person, selectedRequest.rideshare_offers.currency)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Vaše zpráva */}
                          <div>
                            <h4 className="font-semibold mb-2">Vaše zpráva</h4>
                            <div className="bg-muted/10 p-3 rounded-lg text-sm">
                              {selectedRequest.message}
                            </div>
                          </div>

                          {/* Kontaktní údaje */}
                          {(selectedRequest.requester_email || selectedRequest.requester_phone) && (
                            <div>
                              <h4 className="font-semibold mb-2">Poskytnuté kontaktní údaje</h4>
                              <div className="text-sm space-y-1">
                                {selectedRequest.requester_email && (
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <strong>Email:</strong> {selectedRequest.requester_email}
                                  </div>
                                )}
                                {selectedRequest.requester_phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <strong>Telefon:</strong> 
                                    {selectedRequest.requester_country_code && (
                                      <span>{selectedRequest.requester_country_code} </span>
                                    )}
                                    {selectedRequest.requester_phone}
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
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RideRequests;