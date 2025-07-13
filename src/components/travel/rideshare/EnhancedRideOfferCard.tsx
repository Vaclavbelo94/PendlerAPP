import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MapPin, Calendar, Users, MessageCircle, Phone, Star, Car, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { RideshareOffer, rideshareService } from "@/services/rideshareService";
import { useTranslation } from 'react-i18next';
import { formatPhoneNumber, getDriverDisplayName, getCountryConfig } from '@/utils/countryUtils';
import { convertPrice, formatCurrencyWithSymbol, getDefaultCurrencyByLanguage } from '@/utils/currencyUtils';
import { toast } from '@/hooks/use-toast';

interface EnhancedRideOfferCardProps {
  ride: RideshareOffer & {
    driver?: {
      username?: string;
      phone_number?: string;
      rating?: number;
      completed_rides?: number;
    };
  };
  onContact: (ride: any) => void;
  isAuthenticated: boolean;
  currentUserId?: string;
  onOfferUpdate?: () => void;
  showManagementButtons?: boolean;
}

const EnhancedRideOfferCard = ({ ride, onContact, isAuthenticated, currentUserId, onOfferUpdate, showManagementButtons = false }: EnhancedRideOfferCardProps) => {
  const { t, i18n } = useTranslation('travel');
  const isOwnRide = ride.user_id === currentUserId;
  const driverName = getDriverDisplayName(ride.driver, t);
  const hasPhoneNumber = ride.driver?.phone_number && String(ride.driver.phone_number).length > 4;
  const countryConfig = getCountryConfig(i18n.language);

  const handleCall = () => {
    if (hasPhoneNumber) {
      const formattedPhone = formatPhoneNumber(ride.driver.phone_number, i18n.language);
      window.location.href = `tel:${formattedPhone}`;
    }
  };

  const formatRating = (rating?: number) => {
    if (!rating || rating === 0) return t('newDriver') || 'Nový';
    return rating.toFixed(1);
  };

  const formatPrice = (price: number, originalCurrency: string) => {
    if (price === 0) return t('freeRide') || 'Zdarma';
    
    // Get user's preferred currency based on language
    const preferredCurrency = getDefaultCurrencyByLanguage(i18n.language);
    
    // Convert price if needed
    const convertedPrice = convertPrice(price, originalCurrency, preferredCurrency);
    
    return formatCurrencyWithSymbol(convertedPrice, preferredCurrency);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(i18n.language, {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return dateString;
    }
  };

  const handleDeleteOffer = async () => {
    if (!window.confirm(t('confirmDeleteOffer') || 'Opravdu chcete smazat tuto nabídku?')) return;
    
    try {
      await rideshareService.deleteRideshareOffer(ride.id);
      toast({
        title: t('success') || 'Úspěch',
        description: t('offerDeleted') || 'Nabídka byla smazána',
      });
      onOfferUpdate?.();
    } catch (error) {
      toast({
        title: t('error') || 'Chyba',
        description: t('deleteOfferError') || 'Nepodařilo se smazat nabídku',
        variant: 'destructive',
      });
    }
  };

  const handleToggleOffer = async () => {
    try {
      if (ride.is_active) {
        await rideshareService.deactivateRideshareOffer(ride.id);
        toast({
          title: t('success') || 'Úspěch',
          description: t('offerDeactivated') || 'Nabídka byla deaktivována',
        });
      } else {
        await rideshareService.reactivateRideshareOffer(ride.id);
        toast({
          title: t('success') || 'Úspěch',
          description: t('offerReactivated') || 'Nabídka byla aktivována',
        });
      }
      onOfferUpdate?.();
    } catch (error) {
      toast({
        title: t('error') || 'Chyba',
        description: t('toggleOfferError') || 'Nepodařilo se změnit stav nabídky',
        variant: 'destructive',
      });
    }
  };

  const isExpired = new Date(ride.departure_date) < new Date();

  return (
    <Card className={`w-full h-full transition-all duration-200 hover:shadow-lg border hover:border-primary/20 bg-card ${!ride.is_active ? 'opacity-60' : ''} ${isExpired ? 'border-orange-200' : ''}`}>
      {/* Header: Driver info and seats */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {driverName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base leading-tight truncate">{driverName}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <div className="flex items-center">
                  <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                  <span>{formatRating(ride.driver?.rating)}</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <Car className="h-3 w-3 mr-1" />
                  <span>{ride.driver?.completed_rides || 0} {t('rides') || 'jízd'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!ride.is_active && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                {t('inactive') || 'Neaktivní'}
              </Badge>
            )}
            {isExpired && (
              <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                {t('expired') || 'Prošlá'}
              </Badge>
            )}
            <Badge variant="secondary" className="flex items-center gap-1 text-xs font-medium shrink-0">
              <Users className="h-3 w-3" />
              {ride.seats_available}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Trip details */}
      <CardContent className="pt-0 pb-4 space-y-4">
        {/* Date, Time and Price */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">{formatDate(ride.departure_date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-medium">{ride.departure_time}</span>
          </div>
          <div className="ml-auto">
            <Badge 
              variant={ride.price_per_person === 0 ? "secondary" : "outline"} 
              className={ride.price_per_person === 0 ? "text-green-700 bg-green-50" : "text-green-600 border-green-200"}
            >
              {formatPrice(ride.price_per_person, ride.currency || 'EUR')}
            </Badge>
          </div>
        </div>

        {/* Route */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <div className="w-0.5 h-4 bg-border my-1"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-0.5">{t('from') || 'Z'}</p>
                <p className="text-sm font-medium leading-tight break-words">{ride.origin_address}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-0.5">{t('to') || 'Do'}</p>
                <p className="text-sm font-medium leading-tight break-words">{ride.destination_address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {ride.notes && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground italic leading-relaxed">{ride.notes}</p>
          </div>
        )}
      </CardContent>

      {/* Actions */}
      <CardFooter className="pt-0 flex gap-2">
        {showManagementButtons && isOwnRide ? (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleToggleOffer}
              className="flex-1"
            >
              {ride.is_active ? (
                <>
                  <ToggleLeft className="h-4 w-4 mr-2" />
                  {t('deactivate') || 'Deaktivovat'}
                </>
              ) : (
                <>
                  <ToggleRight className="h-4 w-4 mr-2" />
                  {t('activate') || 'Aktivovat'}
                </>
              )}
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDeleteOffer}
              className="shrink-0 px-3"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button 
              className="flex-1" 
              onClick={() => onContact(ride)}
              disabled={!isAuthenticated || isOwnRide || !ride.is_active}
              variant={isOwnRide ? "outline" : "default"}
              size="sm"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {isOwnRide ? (t('yourOffer') || 'Vaše nabídka') : (t('contactDriver') || 'Kontaktovat')}
            </Button>
            
            {hasPhoneNumber && !isOwnRide && isAuthenticated && ride.is_active && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCall}
                className="shrink-0 px-3"
              >
                <Phone className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default EnhancedRideOfferCard;