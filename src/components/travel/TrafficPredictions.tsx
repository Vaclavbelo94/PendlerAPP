
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Calendar, AlertTriangle, ThumbsUp, CalendarClock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const TrafficPredictions = () => {
  const [route, setRoute] = useState({ from: "", to: "" });
  const [selectedDay, setSelectedDay] = useState("monday");
  const [selectedTime, setSelectedTime] = useState("07:30");
  
  const weekdays = [
    { id: "monday", name: "Pondělí" },
    { id: "tuesday", name: "Úterý" },
    { id: "wednesday", name: "Středa" },
    { id: "thursday", name: "Čtvrtek" },
    { id: "friday", name: "Pátek" },
    { id: "saturday", name: "Sobota" },
    { id: "sunday", name: "Neděle" }
  ];
  
  // Sample traffic predictions
  const trafficPredictions = [
    {
      day: "monday",
      conditions: [
        { time: "06:00", status: "normal", description: "Běžný provoz, průměrná doba jízdy 45 minut.", minutes: 45 },
        { time: "07:00", status: "heavy", description: "Zvýšený provoz, očekávané zdržení 15-20 minut v oblasti Prahy.", minutes: 65 },
        { time: "08:00", status: "very-heavy", description: "Husté dopravní špičky, silné zdržení v okolí Drážďan.", minutes: 75 },
        { time: "16:00", status: "heavy", description: "Odpolední špička, očekávané zdržení 10-15 minut.", minutes: 55 },
        { time: "17:00", status: "very-heavy", description: "Velmi hustý provoz při návratu, zejména u sjezdů z dálnice.", minutes: 70 },
        { time: "18:00", status: "normal", description: "Provoz se zklidňuje, jen lokální zdržení.", minutes: 50 }
      ]
    },
    {
      day: "friday",
      conditions: [
        { time: "14:00", status: "heavy", description: "Zvýšený páteční provoz, začátek víkendových cest.", minutes: 60 },
        { time: "15:00", status: "very-heavy", description: "Velmi hustý provoz, očekávané zdržení 25-30 minut.", minutes: 75 },
        { time: "16:00", status: "extreme", description: "Extrémně hustý provoz, doporučujeme alternativní trasu.", minutes: 90 }
      ]
    },
  ];
  
  // Find prediction for selected day and time
  const getCurrentPrediction = () => {
    const dayPredictions = trafficPredictions.find(p => p.day === selectedDay);
    if (!dayPredictions) return null;
    
    // Find closest time
    const selectedHour = parseInt(selectedTime.split(':')[0]);
    let closestPrediction = dayPredictions.conditions[0];
    
    for (const prediction of dayPredictions.conditions) {
      const predictionHour = parseInt(prediction.time.split(':')[0]);
      const currentClosestHour = parseInt(closestPrediction.time.split(':')[0]);
      
      if (Math.abs(predictionHour - selectedHour) < Math.abs(currentClosestHour - selectedHour)) {
        closestPrediction = prediction;
      }
    }
    
    return closestPrediction;
  };
  
  const prediction = getCurrentPrediction();
  
  const getStatusColor = (status) => {
    switch (status) {
      case "normal": return "text-green-500";
      case "heavy": return "text-yellow-500";
      case "very-heavy": return "text-orange-500";
      case "extreme": return "text-red-500";
      default: return "";
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "normal": return <ThumbsUp className="h-5 w-5 text-green-500" />;
      case "heavy": 
      case "very-heavy": 
      case "extreme": return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default: return null;
    }
  };
  
  const handleAnalyzeRoute = () => {
    if (!route.from || !route.to) {
      toast({
        title: "Chybí údaje",
        description: "Zadejte prosím místo odjezdu a cíl.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, this would trigger an API call to get predictions
    toast({
      title: "Trasa analyzována",
      description: `Analýza dopravní situace pro trasu ${route.from} → ${route.to} byla dokončena.`,
    });
  };
  
  // Sample shift data for integration with shift planning
  const shifts = [
    { date: "2023-06-15", startTime: "06:00", type: "morning" },
    { date: "2023-06-16", startTime: "14:00", type: "afternoon" },
    { date: "2023-06-17", startTime: "22:00", type: "night" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Predikce dopravní situace</CardTitle>
          <CardDescription>Analyzujte dopravní situaci na vaší trase podle dne a času.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="route-from">Místo odjezdu</Label>
              <Input 
                id="route-from" 
                placeholder="Odkud vyjíždíte" 
                value={route.from}
                onChange={(e) => setRoute({...route, from: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="route-to">Cíl cesty</Label>
              <Input 
                id="route-to" 
                placeholder="Kam jedete" 
                value={route.to}
                onChange={(e) => setRoute({...route, to: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="route-day">Den v týdnu</Label>
              <Select 
                value={selectedDay}
                onValueChange={setSelectedDay}
              >
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
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={handleAnalyzeRoute} className="w-full">Analyzovat trasu</Button>
        </CardContent>
      </Card>
      
      {prediction && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Předpověď dopravy</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  {weekdays.find(d => d.id === selectedDay)?.name}
                  <Clock className="h-4 w-4 ml-2" />
                  {selectedTime}
                </CardDescription>
              </div>
              {getStatusIcon(prediction.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Očekávaná doba jízdy:</p>
                  <p className="text-xl font-bold">{prediction.minutes} minut</p>
                </div>
                <p className="text-sm">
                  <span className={`font-medium ${getStatusColor(prediction.status)}`}>
                    {prediction.status === "normal" ? "Běžný provoz" : 
                     prediction.status === "heavy" ? "Zvýšený provoz" : 
                     prediction.status === "very-heavy" ? "Velmi hustý provoz" : 
                     "Extrémně hustý provoz"}
                  </span>
                  <span className="text-muted-foreground"> - {prediction.description}</span>
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Doporučení:</p>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  {prediction.status === "normal" ? (
                    <li>Žádná zvláštní doporučení, cesta by měla proběhnout bez komplikací.</li>
                  ) : (
                    <>
                      <li>Vyjeďte o {prediction.status === "heavy" ? "10" : prediction.status === "very-heavy" ? "20" : "30"} minut dříve.</li>
                      <li>Zvažte alternativní trasu přes {route.from === "Praha" ? "Lovosice a Ústí nad Labem" : "Mladou Boleslav a Liberec"}.</li>
                      {prediction.status === "extreme" && <li>Pokud je to možné, přeložte cestu na jiný čas nebo den.</li>}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Integrace s vašimi směnami</CardTitle>
          <CardDescription>Predikce dopravy pro vaše naplánované směny</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shifts.length > 0 ? (
              shifts.map((shift, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CalendarClock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{shift.date}</p>
                      <p className="text-sm text-muted-foreground">
                        Začátek směny: {shift.startTime}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Zobrazit predikci</Button>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                <p>Nemáte žádné naplánované směny. Přidejte je v sekci "Plánování směn".</p>
                <Button className="mt-2" variant="outline">
                  Přejít na plánování směn
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficPredictions;
