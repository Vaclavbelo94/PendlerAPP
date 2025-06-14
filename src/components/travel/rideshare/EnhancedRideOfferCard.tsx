
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
  const hasPhoneNumber = ride.driver?.phone_number;

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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Driver Info Header */}
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {driverName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{driverName}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                  <span>{formatRating(ride.rating)}</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <Car className="h-3 w-3 mr-1" />
                  <span>{ride.completed_rides || 0} jízd</span>
                </div>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {ride.seats_available} míst
          </Badge>
        </div>
      </CardHeader>

      {/* Trip Details */}
      <CardContent className="pt-4 pb-4">
        <div className="space-y-4">
          {/* Date and Time */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{ride.departure_date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{ride.departure_time}</span>
            </div>
          </div>

          {/* Route */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center mt-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="w-px h-6 bg-border"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">ODKUD</p>
                  <p className="text-sm font-medium line-clamp-2">{ride.origin_address}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">KAM</p>
                  <p className="text-sm font-medium line-clamp-2">{ride.destination_address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Price and Notes */}
          <div className="space-y-2">
            {ride.price_per_person > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cena za osobu:</span>
                <span className="font-semibold text-green-600">{ride.price_per_person} Kč</span>
              </div>
            )}
            {ride.notes && (
              <div className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                <p className="italic">"{ride.notes}"</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="pt-3 border-t bg-gray-50/50 dark:bg-gray-900/50">
        {isOwnRide ? (
          <div className="w-full text-center">
            <Badge variant="secondary">Vaše nabídka</Badge>
          </div>
        ) : (
          <div className="w-full space-y-2">
            {hasPhoneNumber ? (
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={handleCall}
                  disabled={!isAuthenticated}
                  className="flex-1"
                  size="sm"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Zavolat
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => onContact(ride)}
                  disabled={!isAuthenticated}
                  className="flex-1"
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
                className="w-full"
                size="sm"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Kontaktovat řidiče
              </Button>
            )}
            {!isAuthenticated && (
              <p className="text-xs text-center text-muted-foreground">
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
