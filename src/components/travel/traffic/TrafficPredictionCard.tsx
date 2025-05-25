
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ThumbsUp, AlertTriangle } from "lucide-react";

interface TrafficCondition {
  time: string;
  status: string;
  description: string;
  minutes: number;
  congestion: number;
}

interface TrafficPredictionCardProps {
  prediction: TrafficCondition;
  selectedDay: string;
  selectedTime: string;
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

const TrafficPredictionCard = ({ prediction, selectedDay, selectedTime }: TrafficPredictionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "text-green-500";
      case "heavy": return "text-yellow-500";
      case "very-heavy": return "text-orange-500";
      case "extreme": return "text-red-500";
      default: return "";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal": return <ThumbsUp className="h-5 w-5 text-green-500" />;
      case "heavy": 
      case "very-heavy": 
      case "extreme": return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default: return null;
    }
  };

  return (
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
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-muted-foreground">Doba jízdy</p>
                <p className="text-2xl font-bold">{prediction.minutes} min</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Zatížení</p>
                <p className="text-2xl font-bold">{prediction.congestion}%</p>
              </div>
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
                  <li>Zvažte alternativní trasu nebo jiný dopravní prostředek.</li>
                  {prediction.status === "extreme" && <li>Pokud je to možné, přeložte cestu na jiný čas.</li>}
                </>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficPredictionCard;
