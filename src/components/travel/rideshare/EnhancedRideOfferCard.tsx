
import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MapPin, Calendar, Users, MessageCircle, Phone, Star, Car } from "lucide-react";
import { RideshareOffer } from "@/services/rideshareService";

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
}

const EnhancedRideOfferCard = ({ ride, onContact, isAuthenticated, currentUserId }: EnhancedRideOfferCardProps) => {
  const isOwnRide = ride.user_id === currentUserId;
  const driverName = ride.driver?.username || 'Neznámý řidič';
  const hasPhoneNumber = ride.driver?.phone_number && String(ride.driver.phone_number).length > 4;

  const handleCall = () => {
    if (hasPhoneNumber) {
      window.location.href = `tel:${ride.driver.phone_number}`;
    }
  };

  const formatRating = (rating?: number) => {
    if (!rating || rating === 0) return 'Nový řidič';
    return rating.toFixed(1);
  };

  return (
    <Card className="w-full max-w-full transition-shadow rounded-xl shadow-sm border bg-white dark:bg-gray-950
      px-2 py-2 sm:p-4 mb-2 relative
      ">
      {/* Header: Driver info and seats */}
      <CardHeader className="p-0 pb-2 bg-transparent border-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {driverName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium text-base sm:text-lg leading-tight">{driverName}</h3>
            <div className="flex flex-wrap gap-x-2 items-center text-xs text-muted-foreground">
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                <span>{formatRating(ride.rating)}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center">
                <Car className="h-3.5 w-3.5 mr-1" />
                <span>{ride.completed_rides || 0} jízd</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 text-xs sm:text-sm py-1 px-2 whitespace-nowrap">
            <Users className="h-3.5 w-3.5" />
            {ride.seats_available} míst
          </Badge>
        </div>
      </CardHeader>

      {/* Trip details */}
      <CardContent className="p-0 mt-2 mb-1">
        {/* Date, Time, Price row */}
        <div className="flex flex-col sm:flex-row gap-2 mb-3 items-start sm:items-center">
          <div className="flex items-center gap-1.5 mr-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">{ride.departure_date}</span>
          </div>
          <div className="flex items-center gap-1.5 mr-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">{ride.departure_time}</span>
          </div>
          {ride.price_per_person > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Cena:</span>
              <span className="font-semibold text-green-600 text-base">{ride.price_per_person} Kč</span>
            </div>
          )}
        </div>
        {/* Route row */}
        <div className="flex flex-row gap-3">
          <div className="flex flex-col items-center justify-center mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-px h-6 bg-border"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <div className="flex-1 flex flex-col gap-0.5">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Odkud</p>
              <p className="text-sm font-medium break-words leading-tight">{ride.origin_address}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Kam</p>
              <p className="text-sm font-medium break-words leading-tight">{ride.destination_address}</p>
            </div>
          </div>
        </div>
        {/* Phone & Notes */}
        <div className="my-2">
          {ride.driver?.phone_number && (
            <div className="flex items-center gap-2 text-sm mb-1">
              <Phone className="h-4 w-4 text-primary" />
              <span className="font-medium break-all">{ride.driver.phone_number}</span>
            </div>
          )}
          {ride.notes && (
            <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-900 p-2 rounded mt-1 break-words">
              <span className="italic">&quot;{ride.notes}&quot;</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer: actions */}
      <CardFooter className="p-0 pt-2 mt-1 border-t-0 bg-transparent">
        {isOwnRide ? (
          <div className="w-full text-center">
            <Badge variant="secondary">Vaše nabídka</Badge>
          </div>
        ) : (
          <div className="w-full space-y-1">
            {hasPhoneNumber ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button 
                  onClick={handleCall}
                  disabled={!isAuthenticated}
                  className="w-full sm:flex-1 text-sm h-10"
                  size="sm"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Zavolat
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => onContact(ride)}
                  disabled={!isAuthenticated}
                  className="w-full sm:flex-1 text-sm h-10"
                  size="sm"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Zpráva
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => onContact(ride)}
                disabled={!isAuthenticated}
                className="w-full text-sm h-10"
                size="sm"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Kontaktovat řidiče
              </Button>
            )}
            {!isAuthenticated && (
              <p className="text-xs text-center text-muted-foreground mt-1">
                Pro kontaktování se musíte přihlásit
              </p>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default EnhancedRideOfferCard;
