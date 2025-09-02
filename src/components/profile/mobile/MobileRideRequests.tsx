import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Car, Clock, CheckCircle, XCircle, Phone, Mail, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { fixedRideshareService, RideRequest } from '@/services/fixedRideshareService';
import { formatDate } from '@/utils/enhancedCountryUtils';
import { formatCurrencyWithSymbol } from '@/utils/currencyUtils';

export const MobileRideRequests: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { t, i18n } = useTranslation(['profile', 'travel']);
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RideRequest | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  const fetchRequests = async () => {
    if (!user?.id || authLoading) {
      console.log('⏳ Waiting for user auth...');
      return;
    }

    try {
      console.log('🔄 MobileRideRequests: Fetching requests for user:', user.id);
      setLoading(true);
      const data = await fixedRideshareService.getUserRideRequests(user.id);
      console.log('✅ Loaded requests:', data?.length || 0);
      setRequests(data);
    } catch (error) {
      console.error('❌ Error fetching requests:', error);
      toast.error(t('profile:rideRequestsError') || 'Chyba při načítání žádostí');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id && !authLoading) {
      fetchRequests();
    }
  }, [user?.id, authLoading]);

  const handleStatusUpdate = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      setActionLoading(requestId);
      await fixedRideshareService.updateRequestStatus(requestId, status);
      
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status, updated_at: new Date().toISOString() }
            : req
        )
      );
      
      toast.success(
        status === 'accepted' 
          ? (t('travel:rideRequestAccepted') || 'Žádost přijata')
          : (t('travel:rideRequestRejected') || 'Žádost odmítnuta')
      );
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Chyba při aktualizaci žádosti');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRating = async () => {
    if (!selectedRequest || rating === 0) return;

    try {
      await fixedRideshareService.rateRequest(selectedRequest.id, rating, review);
      
      setRequests(prev =>
        prev.map(req =>
          req.id === selectedRequest.id
            ? { ...req, rating, review }
            : req
        )
      );
      
      setSelectedRequest(null);
      setRating(0);
      setReview('');
      toast.success(t('travel:ratingSaved') || 'Hodnocení uloženo');
    } catch (error) {
      console.error('Error rating request:', error);
      toast.error(t('travel:ratingError') || 'Chyba při ukládání hodnocení');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: Clock, text: t('travel:pending') || 'Čeká' },
      accepted: { variant: 'default' as const, icon: CheckCircle, text: t('travel:accepted') || 'Přijato' },
      rejected: { variant: 'destructive' as const, icon: XCircle, text: t('travel:rejected') || 'Odmítnuto' }
    };
    
    const config = variants[status as keyof typeof variants];
    if (!config) return null;
    
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const formatPrice = (price: number, currency: string) => {
    return formatCurrencyWithSymbol(price, currency);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          {t('profile:rideRequests') || 'Žádosti o spolujízdu'} ({requests.length === 1 ? t('profile:oneRequest') || '1 žádost' : `${requests.length} ${t('profile:requestsCount') || 'žádostí'}`})
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRequests}
          disabled={loading}
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-12"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </motion.div>
        ) : requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 px-4"
          >
            <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="font-medium text-muted-foreground mb-2">
              {t('profile:noRideRequests') || 'Žádné žádosti o spolujízdu'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {t('profile:noRideRequestsDesc') || 'Zde se zobrazí žádosti od ostatních uživatelů ohledně vašich nabídek spolujízdy'}
            </p>
            <p className="text-xs text-muted-foreground">
              💡 {t('profile:rideRequestsHint') || 'Chcete-li dostávat žádosti o spolujízdu, nejprve vytvořte nabídku jízdy v sekci Spolujízda'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium text-sm">
                          {request.rideshare_offers.origin_address} → {request.rideshare_offers.destination_address}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(request.rideshare_offers.departure_date, i18n.language)} • {request.rideshare_offers.departure_time}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    {/* Request details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{request.requester_email}</span>
                      </div>
                      
                      {request.phone_number && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{request.country_code} {request.phone_number}</span>
                        </div>
                      )}
                      
                      {request.message && (
                        <div className="flex items-start gap-2 text-sm">
                          <MessageCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="line-clamp-2">{request.message}</span>
                        </div>
                      )}
                    </div>

                    {/* Price and actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="font-semibold text-primary">
                        {formatPrice(request.rideshare_offers.price_per_person, request.rideshare_offers.currency)}
                      </span>
                      
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(request.id, 'rejected')}
                              disabled={actionLoading === request.id}
                              className="text-xs"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              {t('travel:reject') || 'Odmítnout'}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(request.id, 'accepted')}
                              disabled={actionLoading === request.id}
                              className="text-xs"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {t('travel:accept') || 'Přijmout'}
                            </Button>
                          </>
                        )}
                        
                        {request.status === 'accepted' && !request.rating && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedRequest(request)}
                            className="text-xs"
                          >
                            <Star className="h-3 w-3 mr-1" />
                            {t('travel:rate') || 'Hodnotit'}
                          </Button>
                        )}
                        
                        {request.rating && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {request.rating}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg">{t('travel:ratingTitle') || 'Hodnocení spolujízdy'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('travel:ratingLabel') || 'Hodnocení (1-5 hvězd)'}</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">{t('travel:reviewLabel') || 'Recenze (volitelné)'}</label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder={t('travel:reviewPlaceholder') || 'Napište svou zkušenost se spolujízdou...'}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedRequest(null)}
                className="flex-1"
              >
                {t('travel:cancel') || 'Zrušit'}
              </Button>
              <Button
                onClick={handleRating}
                disabled={rating === 0}
                className="flex-1"
              >
                {t('travel:save') || 'Uložit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};