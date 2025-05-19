
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RouteFormProps {
  origin: string;
  destination: string;
  departureTime: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onDepartureTimeChange: (value: string) => void;
}

const RouteForm = ({ 
  origin, 
  destination, 
  departureTime,
  onOriginChange,
  onDestinationChange,
  onDepartureTimeChange
}: RouteFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="origin">Místo odjezdu</Label>
        <Input 
          id="origin" 
          placeholder="Zadejte adresu nebo místo odjezdu" 
          value={origin} 
          onChange={(e) => onOriginChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="destination">Cíl cesty</Label>
        <Input 
          id="destination" 
          placeholder="Zadejte adresu nebo cíl cesty" 
          value={destination} 
          onChange={(e) => onDestinationChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="departure-time">Čas odjezdu</Label>
        <Input 
          id="departure-time" 
          type="time" 
          value={departureTime}
          onChange={(e) => onDepartureTimeChange(e.target.value)}
        />
      </div>
    </>
  );
};

export default RouteForm;
