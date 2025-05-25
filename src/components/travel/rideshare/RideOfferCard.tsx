
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, User, Users, MessageCircle } from "lucide-react";
import { RideshareOffer } from "@/services/rideshareService";

interface RideOfferCardProps {
  ride: RideshareOffer;
  onContact: (ride: RideshareOffer) => void;
  isAuthenticated: boolean;
}

const RideOfferCard = ({ ride, onContact, isAuthenticated }: RideOfferCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" /> Řidič
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {ride.seats_available} míst
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {ride.departure_date}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Odkud</p>
                <p className="text-sm text-muted-foreground">{ride.origin_address}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Kam</p>
                <p className="text-sm text-muted-foreground">{ride.destination_address}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Odjezd</p>
                <p className="text-sm text-muted-foreground">{ride.departure_time}</p>
              </div>
            </div>
            
            {ride.price_per_person && (
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Cena:</p>
                <p className="text-sm">{ride.price_per_person} CZK</p>
              </div>
            )}
            
            {ride.notes && (
              <p className="text-sm text-muted-foreground italic">{ride.notes}</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onContact(ride)}
          variant="outline"
          disabled={!isAuthenticated}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Kontaktovat řidiče
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RideOfferCard;
