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
  
  if (ride.price_per_person === 0) {
    formattedPrice = t('free');
  } else {
    // Original price
    formattedPrice = formatCurrencyWithSymbol(ride.price_per_person, ride.currency);
    
    // Converted price if different currency
    if (ride.currency !== userCurrency) {
      const converted = convertPrice(ride.price_per_person, ride.currency, userCurrency);
      convertedPrice = formatCurrencyWithSymbol(converted, userCurrency);
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
        <CardContent className="p-6 relative">
          {/* Header with Driver Info and Price */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 ring-2 ring-primary/20 shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold text-lg">
                  {getDriverInitials(displayDriverName)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-foreground">{displayDriverName}</h3>
                  {ride.driver.rating && (
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                        {ride.driver.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{ride.seats_available} {t('seats')}</span>
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
            <div className="text-right">
              <div className="flex items-center gap-1 font-bold text-xl text-primary mb-1">
                <Euro className="h-5 w-5" />
                <span>{formattedPrice}</span>
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
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium text-primary">{t('from')}</span>
                </div>
                <p className="text-sm font-semibold truncate pl-5">{ride.origin_address}</p>
              </div>
              
              <div className="flex-shrink-0 px-3">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <span className="text-sm font-medium text-destructive">{t('to')}</span>
                </div>
                <p className="text-sm font-semibold truncate pl-5">{ride.destination_address}</p>
              </div>
            </div>
          </div>

          {/* Trip Details with Enhanced Design */}
          <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 bg-accent/10 px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-accent-foreground" />
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
          <div className="flex items-center gap-3 pt-2 border-t border-border/30">
            {!isOwner ? (
              <>
                {ride.driver.phone_number && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCall}
                    className="flex items-center gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-950 dark:hover:text-green-400 transition-all duration-200"
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
                  className="flex items-center gap-2 flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
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
                  className="flex items-center gap-2 ml-auto hover:bg-red-600 transition-colors"
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