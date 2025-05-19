
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Car, Train, Bus, Bike } from "lucide-react";

interface TransportOption {
  id: string;
  name: string;
  icon: React.ElementType;
}

const transportOptions: TransportOption[] = [
  { id: 'car', name: 'Auto', icon: Car },
  { id: 'public', name: 'Veřejná doprava', icon: Train },
  { id: 'bus', name: 'Autobus', icon: Bus },
  { id: 'bike', name: 'Kolo', icon: Bike },
];

interface TransportModeSelectorProps {
  selectedModes: string[];
  onToggleMode: (mode: string) => void;
}

const TransportModeSelector = ({ selectedModes, onToggleMode }: TransportModeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Dopravní prostředky</Label>
      <div className="flex flex-wrap gap-2">
        {transportOptions.map(option => (
          <Button
            key={option.id}
            variant={selectedModes.includes(option.id) ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleMode(option.id)}
            className="flex items-center gap-2"
          >
            <option.icon className="h-4 w-4" />
            {option.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TransportModeSelector;
