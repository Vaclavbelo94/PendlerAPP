import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MapPin, 
  Clock, 
  Users, 
  Calendar,
  MessageCircle,
  Phone,
  Star,
  ArrowRight,
  Car
} from 'lucide-react';
import { RideshareOfferWithDriver } from '@/services/rideshareService';
import { formatDate } from '@/utils/enhancedCountryUtils';
import { useTranslation } from 'react-i18next';
import { formatCurrencyWithSymbol } from '@/utils/currencyUtils';
import { useAuth } from '@/hooks/auth';
import { useToast } from '@/hooks/use-toast';

interface NewRideOfferCardProps {
  ride: RideshareOfferWithDriver;
  onSendMessage: (ride: RideshareOfferWithDriver) => void;
}

const NewRideOfferCard: React.FC<NewRideOfferCardProps> = ({
  ride,
  onSendMessage
}) => {
  const { t, i18n } = useTranslation('travel');
  const auth = useAuth();
  const user = auth.user;
  const isAuthenticated = !!user;
  const { toast } = useToast();
  
  const isOwner = user?.id === ride.user_id;
  const formattedDate = formatDate(ride.departure_date, i18n.language);
  
  // Format price
  const formattedPrice = !ride.price_per_person || ride.price_per_person === 0 
    ? t('free') 
    : formatCurrencyWithSymbol(ride.price_per_person);

  const handleCall = () => {
    if (!isAuthenticated) {
      toast({
        title: t('loginRequired'),
        description: t('loginRequired'),
        variant: 'destructive'
      });
      return;
    }
    
    if (ride.driver.phone_number) {
      window.open(`tel:${ride.driver.phone_number}`);
    } else {
      toast({
        title: t('error'),
        description: t('phoneNumber'),
        variant: 'destructive'
      });
    }
  };

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      toast({
        title: t('loginRequired'),
        description: t('loginRequired'),
        variant: 'destructive'
      });
      return;
    }
    
    onSendMessage(ride);
  };

  const getDriverInitials = (username: string) => {
    if (!username || username.trim() === '') return 'NU';
    return username.substring(0, 2).toUpperCase();
  };

  const displayDriverName = ride.driver.username || t('unknownDriver');

  return (
    <Card className="w-full overflow-hidden border border-border/20 shadow-sm hover:shadow-md transition-all duration-300 bg-card">
      <CardContent className="p-4 space-y-4">
        {/* Driver Header */}
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {getDriverInitials(displayDriverName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base text-foreground truncate">
                {displayDriverName}
              </h3>
              
              {ride.driver.rating && ride.driver.rating > 0 ? (
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                    {ride.driver.rating.toFixed(1)}
                  </span>
                </div>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  {t('newDriver')}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{ride.seats_available} {t('seats')}</span>
              </div>
              
              {ride.driver.completed_rides && ride.driver.completed_rides > 0 && (
                <div className="flex items-center gap-1">
                  <Car className="h-3 w-3" />
                  <span>{ride.driver.completed_rides} {t('rides')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="font-bold text-lg text-primary">
              {formattedPrice}
            </div>
            {ride.price_per_person > 0 && (
              <div className="text-xs text-muted-foreground">
                {t('perPerson')}
              </div>
            )}
          </div>
        </div>

        {/* Route */}
        <div className="space-y-3 p-3 bg-muted/20 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                {t('from')}
              </div>
              <div className="text-sm font-medium text-foreground break-words">
                {ride.origin_address}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
                {t('to')}
              </div>
              <div className="text-sm font-medium text-foreground break-words">
                {ride.destination_address}
              </div>
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-primary/5 px-3 py-2 rounded-lg flex-1">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-accent/10 px-3 py-2 rounded-lg flex-1">
            <Clock className="h-4 w-4 text-accent-foreground" />
            <span className="text-sm font-medium">{ride.departure_time}</span>
          </div>
        </div>

        {/* Notes */}
        {ride.notes && (
          <div className="p-3 bg-muted/10 rounded-lg border-l-4 border-primary/30">
            <p className="text-sm text-muted-foreground italic">
              "{ride.notes}"
            </p>
          </div>
        )}

        {/* Action Buttons - Only show for non-owners */}
        {!isOwner && (
          <div className="flex gap-2 pt-2 border-t border-border/10">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCall}
              className="flex items-center gap-2 flex-1 hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-950 dark:hover:text-green-400"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">{t('call')}</span>
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleSendMessage}
              className="flex items-center gap-2 flex-1 bg-primary hover:bg-primary/90"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{t('message')}</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewRideOfferCard;