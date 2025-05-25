
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, Navigation } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import TrafficAnalysisForm from './traffic/TrafficAnalysisForm';
import TrafficPredictionCard from './traffic/TrafficPredictionCard';

interface Shift {
  id: string;
  date: string;
  type: string;
  notes?: string;
}

const TrafficPredictions = () => {
  const { user } = useAuth();
  const [route, setRoute] = useState({ from: "", to: "" });
  const [selectedDay, setSelectedDay] = useState("monday");
  const [selectedTime, setSelectedTime] = useState("07:30");
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  
  // Sample traffic predictions with more realistic data
  const trafficPredictions = [
    {
      day: "monday",
      conditions: [
        { time: "06:00", status: "normal", description: "Běžný provoz, průměrná doba jízdy 45 minut.", minutes: 45, congestion: 15 },
        { time: "07:00", status: "heavy", description: "Zvýšený provoz, očekávané zdržení 15-20 minut v oblasti křižovatek.", minutes: 65, congestion: 40 },
        { time: "08:00", status: "very-heavy", description: "Husté dopravní špičky, silné zdržení na hlavních trasách.", minutes: 75, congestion: 60 },
        { time: "16:00", status: "heavy", description: "Odpolední špička, očekávané zdržení 10-15 minut.", minutes: 55, congestion: 35 },
        { time: "17:00", status: "very-heavy", description: "Velmi hustý provoz při návratu, zejména u sjezdů z dálnice.", minutes: 70, congestion: 55 },
        { time: "18:00", status: "normal", description: "Provoz se zklidňuje, jen lokální zdržení.", minutes: 50, congestion: 20 }
      ]
    },
    {
      day: "friday",
      conditions: [
        { time: "14:00", status: "heavy", description: "Zvýšený páteční provoz, začátek víkendových cest.", minutes: 60, congestion: 45 },
        { time: "15:00", status: "very-heavy", description: "Velmi hustý provoz, očekávané zdržení 25-30 minut.", minutes: 75, congestion: 65 },
        { time: "16:00", status: "extreme", description: "Extrémně hustý provoz, doporučujeme alternativní trasu.", minutes: 90, congestion: 80 }
      ]
    },
  ];

  useEffect(() => {
    if (user?.id) {
      loadUserShifts();
    }
  }, [user?.id]);

  const loadUserShifts = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(10);
      
      if (error) throw error;
      setShifts(data || []);
    } catch (error) {
      console.error('Error loading shifts:', error);
    }
  };
  
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
  
  const handleAnalyzeRoute = async () => {
    if (!route.from || !route.to) {
      toast.error("Zadejte prosím místo odjezdu a cíl.");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Analýza dopravní situace pro trasu ${route.from} → ${route.to} byla dokončena.`);
      setLoading(false);
    }, 1500);
  };

  const getShiftPrediction = (shift: Shift) => {
    const dayOfWeek = new Date(shift.date).getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayPredictions = trafficPredictions.find(p => p.day === dayNames[dayOfWeek]);
    
    if (!dayPredictions) return null;
    
    // Default prediction for shift start time
    return dayPredictions.conditions[Math.floor(Math.random() * dayPredictions.conditions.length)];
  };

  return (
    <div className="space-y-6">
      <TrafficAnalysisForm
        route={route}
        selectedDay={selectedDay}
        selectedTime={selectedTime}
        onRouteChange={setRoute}
        onDayChange={setSelectedDay}
        onTimeChange={setSelectedTime}
        onAnalyze={handleAnalyzeRoute}
        loading={loading}
        isMobile={isMobile}
      />
      
      {prediction && (
        <TrafficPredictionCard
          prediction={prediction}
          selectedDay={selectedDay}
          selectedTime={selectedTime}
        />
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Predikce pro vaše směny</CardTitle>
          <CardDescription>Dopravní predikce pro vaše naplánované směny</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shifts.length > 0 ? (
              shifts.map((shift) => {
                const shiftPrediction = getShiftPrediction(shift);
                return (
                  <div key={shift.id} className={`flex ${isMobile ? 'flex-col' : 'items-center justify-between'} p-4 border rounded-lg`}>
                    <div className="flex items-center gap-3">
                      <CalendarClock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{new Date(shift.date).toLocaleDateString('cs-CZ')}</p>
                        <p className="text-sm text-muted-foreground">
                          Směna: {shift.type}
                        </p>
                        {shiftPrediction && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded bg-muted`}>
                              {shiftPrediction.minutes} min
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className={isMobile ? 'mt-2 w-full' : ''}>
                      <Navigation className="h-4 w-4 mr-2" />
                      Zobrazit detaily
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                <p>Nemáte žádné naplánované směny.</p>
                <Button className="mt-2" variant="outline" onClick={() => window.location.href = '/shifts'}>
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
