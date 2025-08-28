import React from 'react';
import { motion } from 'framer-motion';
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
  ArrowRight,
  Car
} from 'lucide-react';
import { RideshareOfferWithDriver } from '@/services/rideshareService';
import { formatDate } from '@/utils/enhancedCountryUtils';
import { useTranslation } from 'react-i18next';
import { formatCurrencyWithSymbol } from '@/utils/currencyUtils';
import { cn } from '@/lib/utils';

interface ModernRideCardProps {
  ride: RideshareOfferWithDriver;
  onContact: (ride: RideshareOfferWithDriver) => void;
  onDelete?: (offerId: string) => void;
  isAuthenticated: boolean;
  currentUserId?: string;
}

const ModernRideCard: React.FC<ModernRideCardProps> = ({
  ride,
  onContact,
  onDelete,
  isAuthenticated,
  currentUserId
}) => {
  const { t, i18n } = useTranslation('travel');
  
  const isOwner = currentUserId === ride.user_id;
  const formattedDate = formatDate(ride.departure_date, i18n.language);
  
  // Format price in EUR only
  const formattedPrice = !ride.price_per_person || ride.price_per_person === 0 
    ? t('free') 
    : formatCurrencyWithSymbol(ride.price_per_person);

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Call button clicked');
    if (ride.driver.phone_number) {
      window.open(`tel:${ride.driver.phone_number}`);
    }
  };

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Contact button clicked');
    onContact(ride);
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
      whileHover={{ scale: 1.01 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-card via-card/98 to-card/95 hover:shadow-xl transition-all duration-500 hover:border-primary/20 group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <CardContent className="p-4 sm:p-6 relative">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-primary/20 shadow-md flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold text-sm sm:text-lg">
                  {getDriverInitials(displayDriverName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                  <h3 className="font-bold text-base sm:text-lg text-foreground truncate">
                    {displayDriverName}
                  </h3>
                  
                  {ride.driver.rating && ride.driver.rating > 0 ? (
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full self-start">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                        {ride.driver.rating.toFixed(1)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-full self-start">
                      <Star className="h-3 w-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t('newDriver')}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{ride.seats_available || 0} {t('seats')}</span>
                  </div>
                  
                  {ride.driver.completed_rides && ride.driver.completed_rides > 0 ? (
                    <Badge variant="secondary" className="text-xs px-2">
                      <Car className="h-3 w-3 mr-1" />
                      {ride.driver.completed_rides} {t('rides')}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs px-2 text-muted-foreground">
                      {t('newDriver')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Price Display */}
            <div className="text-right sm:text-right w-full sm:w-auto mt-2 sm:mt-0">
              <div className="flex items-center justify-end gap-1 font-bold text-lg sm:text-xl text-primary mb-1">
                {!ride.price_per_person || ride.price_per_person === 0 ? (
                  <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    {formattedPrice}
                  </Badge>
                ) : (
                  <>
                    <Euro className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="whitespace-nowrap">{formattedPrice}</span>
                  </>
                )}
              </div>
              
              {ride.price_per_person > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {t('perPerson')}
                </div>
              )}
            </div>
          </div>

          {/* Route Display */}
          <div className="mb-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-muted/30 via-muted/10 to-muted/30 border border-border/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">{t('from')}</span>
                </div>
                <p className="text-sm font-semibold pl-5 break-words text-foreground">
                  {ride.origin_address}
                </p>
              </div>
              
              <div className="flex-shrink-0 px-3 self-center">
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground rotate-90 sm:rotate-0" />
              </div>
              
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">{t('to')}</span>
                </div>
                <p className="text-sm font-semibold pl-5 break-words text-foreground">
                  {ride.destination_address}
                </p>
              </div>
            </div>
          </div>

          {/* Trip Details */}
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
            <div className="mb-4 p-3 bg-muted/20 rounded-lg border-l-4 border-primary/30">
              <p className="text-sm text-muted-foreground italic">
                "{ride.notes}"
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-3 border-t border-border/20" 
            style={{ pointerEvents: 'auto' }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {!isOwner ? (
              <>
                {ride.driver.phone_number && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCall}
                    className="flex items-center justify-center gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-950 dark:hover:text-green-400 transition-all duration-200 min-h-[44px] touch-manipulation select-none"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <Phone className="h-4 w-4" />
                    <span>{t('call')}</span>
                  </Button>
                )}
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleContact}
                  disabled={!isAuthenticated}
                  className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md min-h-[44px] touch-manipulation select-none"
                  style={{ pointerEvents: 'auto' }}
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

export default ModernRideCard;