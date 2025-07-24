
import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Calendar, Users, MessageCircle, Star, Phone } from "lucide-react";
import { RideshareOfferWithDriver } from "@/services/rideshareService";
import { useTranslation } from 'react-i18next';
import { getCountryConfig, formatCurrency, formatDate, formatTime, getDriverDisplayName } from '@/utils/enhancedCountryUtils';
import { motion } from 'framer-motion';

interface ModernRideOfferCardProps {
  ride: RideshareOfferWithDriver;
  onContact: (ride: RideshareOfferWithDriver) => void;
  isAuthenticated: boolean;
}

const ModernRideOfferCard: React.FC<ModernRideOfferCardProps> = ({ 
  ride, 
  onContact, 
  isAuthenticated 
}) => {
  const { t, i18n } = useTranslation('travel');
  const countryConfig = getCountryConfig(i18n.language);

  const driverName = getDriverDisplayName(ride.driver, t);
  const driverInitials = driverName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={`https://avatar.vercel.sh/${driverName}`} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {driverInitials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">{driverName}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {ride.driver?.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{ride.driver.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {ride.driver?.completed_rides && (
                    <span>• {ride.driver.completed_rides} {t('rides')}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {ride.seats_available}
              </Badge>
              {ride.price_per_person === 0 && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {t('free')}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="space-y-4">
            {/* Route Information */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-0.5 h-8 bg-muted-foreground/20 my-1"></div>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{t('from')}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {ride.origin_address}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{t('to')}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {ride.destination_address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/50">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatDate(ride.departure_date, i18n.language)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatTime(ride.departure_time, i18n.language)}</span>
                </div>
              </div>
              
              {ride.price_per_person > 0 && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground text-right">{t('pricePerPerson')}</p>
                  <p className="text-lg font-bold text-primary text-right">
                    {formatCurrency(ride.price_per_person, i18n.language)}
                  </p>
                </div>
              )}
            </div>

            {/* Notes */}
            {ride.notes && (
              <div className="pt-3 border-t border-border/50">
                <p className="text-sm text-muted-foreground italic">
                  "{ride.notes}"
                </p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex gap-2 w-full">
            <Button 
              className="flex-1 group-hover:shadow-md transition-shadow" 
              onClick={() => onContact(ride)}
              disabled={!isAuthenticated}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {t('contactDriver')}
            </Button>
            
            {ride.driver?.phone_number && (
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() => window.open(`tel:${ride.driver.phone_number}`)}
              >
                <Phone className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ModernRideOfferCard;
