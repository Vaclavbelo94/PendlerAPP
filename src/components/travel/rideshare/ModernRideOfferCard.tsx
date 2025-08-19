import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MapPin, 
  Clock, 
  Users, 
  Euro,
  Calendar,
  MessageCircle,
  Phone,
  Trash2,
  Star,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RideshareOfferWithDriver } from '@/services/rideshareService';
import { formatDate } from '@/utils/enhancedCountryUtils';
import { useTranslation } from 'react-i18next';
import { convertPrice, formatCurrencyWithSymbol, getDefaultCurrencyByLanguage } from '@/utils/currencyUtils';

interface ModernRideOfferCardProps {
  ride: RideshareOfferWithDriver;
  onContact: (ride: RideshareOfferWithDriver) => void;
  onDelete?: (offerId: string) => void;
  isAuthenticated: boolean;
  currentUserId?: string;
}

const ModernRideOfferCard: React.FC<ModernRideOfferCardProps> = ({
  ride,
  onContact,
  onDelete,
  isAuthenticated,
  currentUserId
}) => {
  const { t, i18n } = useTranslation('travel');
  
  const isOwner = currentUserId === ride.user_id;
  const formattedDate = formatDate(ride.departure_date, i18n.language);
  
  // Get user's preferred currency based on language
  const userCurrency = getDefaultCurrencyByLanguage(i18n.language);
  
  // Format price with currency conversion
  let formattedPrice = '';
  let convertedPrice = '';
  
  if (!ride.price_per_person || ride.price_per_person === 0) {
    formattedPrice = t('free');
  } else {
    try {
      // Original price with fallback currency
      const currency = ride.currency || 'EUR';
      formattedPrice = formatCurrencyWithSymbol(ride.price_per_person, currency);
      
      // Converted price if different currency
      if (currency !== userCurrency) {
        const converted = convertPrice(ride.price_per_person, currency, userCurrency);
        convertedPrice = formatCurrencyWithSymbol(converted, userCurrency);
      }
    } catch (error) {
      console.error('Error formatting price:', error);
      formattedPrice = `${ride.price_per_person} €`;
    }
  }

  const handleCall = () => {
    if (ride.driver.phone_number) {
      window.open(`tel:${ride.driver.phone_number}`);
    }
  };

  const getDriverInitials = (username: string) => {
    if (!username || username.trim() === '') return 'NU';
    return username.substring(0, 2).toUpperCase();
  };

  const displayDriverName = ride.driver.username || t('unknownDriver');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card/95 to-card/90 hover:shadow-2xl transition-all duration-500 hover:border-primary/20 group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardContent className="p-4 sm:p-6 relative">
          {/* Header with Driver Info and Price */}
          <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-primary/20 shadow-lg flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold text-sm sm:text-lg">
                  {getDriverInitials(displayDriverName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                  <h3 className="font-bold text-base sm:text-lg text-foreground truncate">{displayDriverName}</h3>
                  {ride.driver.rating && ride.driver.rating > 0 && (
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full self-start">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                        {ride.driver.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{ride.seats_available || 0} {t('seats')}</span>
                  </div>
                  {ride.driver.completed_rides && ride.driver.completed_rides > 0 && (
                    <Badge variant="secondary" className="text-xs px-2">
                      {ride.driver.completed_rides} {t('rides')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Price Display */}
            <div className="text-right sm:text-right w-full sm:w-auto mt-2 sm:mt-0">
              <div className="flex items-center justify-end gap-1 font-bold text-lg sm:text-xl text-primary mb-1">
                <Euro className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="whitespace-nowrap">{formattedPrice}</span>
              </div>
              {convertedPrice && (
                <div className="text-sm text-muted-foreground">
                  ({convertedPrice})
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                {t('perPerson')}
              </div>
            </div>
          </div>

          {/* Enhanced Route Display */}
          <div className="mb-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40 border border-border/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0"></div>
                  <span className="text-sm font-medium text-primary">{t('from')}</span>
                </div>
                <p className="text-sm font-semibold pl-5 break-words">{ride.origin_address}</p>
              </div>
              
              <div className="flex-shrink-0 px-3 self-center">
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground rotate-90 sm:rotate-0" />
              </div>
              
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-destructive flex-shrink-0"></div>
                  <span className="text-sm font-medium text-destructive">{t('to')}</span>
                </div>
                <p className="text-sm font-semibold pl-5 break-words">{ride.destination_address}</p>
              </div>
            </div>
          </div>

          {/* Trip Details with Enhanced Design */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-4 text-sm mb-4">
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg flex-1 sm:flex-none">
              <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="font-medium truncate">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 bg-accent/10 px-3 py-2 rounded-lg flex-1 sm:flex-none">
              <Clock className="h-4 w-4 text-accent-foreground flex-shrink-0" />
              <span className="font-medium">{ride.departure_time}</span>
            </div>
          </div>

          {/* Notes */}
          {ride.notes && (
            <div className="mb-4 p-3 bg-muted/30 rounded-lg border-l-4 border-primary/30">
              <p className="text-sm text-muted-foreground italic">{ride.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-3 border-t border-border/30">
            {!isOwner ? (
              <>
                {ride.driver.phone_number && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCall}
                    className="flex items-center justify-center gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-950 dark:hover:text-green-400 transition-all duration-200 min-h-[44px]"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{t('call')}</span>
                  </Button>
                )}
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onContact(ride)}
                  disabled={!isAuthenticated}
                  className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg min-h-[44px]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{t('contactDriver')}</span>
                </Button>
              </>
            ) : (
              onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(ride.id)}
                  className="flex items-center justify-center gap-2 ml-auto hover:bg-red-600 transition-colors min-h-[44px]"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{t('deleteOffer')}</span>
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ModernRideOfferCard;