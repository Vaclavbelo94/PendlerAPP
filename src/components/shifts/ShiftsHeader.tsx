
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ShiftsHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToTravel = () => {
    navigate('/travel-planning');
  };

  return (
    <div className="mb-8 text-center md:text-left">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Směny</h1>
      <p className="text-muted-foreground text-lg">
        Plánujte a sledujte své pracovní směny efektivně
      </p>
      
      <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="font-medium text-lg">Potřebujete naplánovat cestu?</h3>
            <p className="text-sm text-muted-foreground">
              Optimalizujte své dojíždění a najděte spolujízdy v sekci Doprava
            </p>
          </div>
          <Button onClick={handleNavigateToTravel} className="flex items-center gap-2 w-full md:w-auto">
            <MapIcon className="h-4 w-4" />
            Plánování cest
          </Button>
        </div>
      </div>
    </div>
  );
};
