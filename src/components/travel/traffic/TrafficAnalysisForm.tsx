
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddressAutocomplete from '../AddressAutocomplete';

interface RouteData {
  from: string;
  to: string;
}

interface TrafficAnalysisFormProps {
  route: RouteData;
  selectedDay: string;
  selectedTime: string;
  onRouteChange: (route: RouteData) => void;
  onDayChange: (day: string) => void;
  onTimeChange: (time: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  isMobile: boolean;
}

const weekdays = [
  { id: "monday", name: "Pondělí" },
  { id: "tuesday", name: "Úterý" },
  { id: "wednesday", name: "Středa" },
  { id: "thursday", name: "Čtvrtek" },
  { id: "friday", name: "Pátek" },
  { id: "saturday", name: "Sobota" },
  { id: "sunday", name: "Neděle" }
];

const TrafficAnalysisForm = ({
  route,
  selectedDay,
  selectedTime,
  onRouteChange,
  onDayChange,
  onTimeChange,
  onAnalyze,
  loading,
  isMobile
}: TrafficAnalysisFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Predikce dopravní situace</CardTitle>
        <CardDescription>Analyzujte dopravní situaci na vaší trase podle dne a času.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-4`}>
          <div className="space-y-2">
            <Label htmlFor="route-from">Místo odjezdu</Label>
            <AddressAutocomplete
              value={route.from}
              onChange={(value) => onRouteChange({...route, from: value})}
              placeholder="Odkud vyjíždíte"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="route-to">Cíl cesty</Label>
            <AddressAutocomplete
              value={route.to}
              onChange={(value) => onRouteChange({...route, to: value})}
              placeholder="Kam jedete"
            />
          </div>
        </div>
        
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-4`}>
          <div className="space-y-2">
            <Label htmlFor="route-day">Den v týdnu</Label>
            <Select value={selectedDay} onValueChange={onDayChange}>
              <SelectTrigger id="route-day">
                <SelectValue placeholder="Vyberte den" />
              </SelectTrigger>
              <SelectContent>
                {weekdays.map(day => (
                  <SelectItem key={day.id} value={day.id}>{day.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="route-time">Čas odjezdu</Label>
            <Input 
              id="route-time" 
              type="time"
              value={selectedTime}
              onChange={(e) => onTimeChange(e.target.value)}
            />
          </div>
        </div>
        
        <Button 
          onClick={onAnalyze} 
          className="w-full"
          disabled={loading}
        >
          {loading ? "Analyzuji..." : "Analyzovat trasu"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrafficAnalysisForm;
