
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface EmptyVehicleStateProps {
  onAddVehicle: () => void;
}

const EmptyVehicleState: React.FC<EmptyVehicleStateProps> = ({ onAddVehicle }) => {
  const { t } = useLanguage();

  return (
    <Card className="text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Car className="h-16 w-16 text-muted-foreground" />
        </div>
        <CardTitle>{t('noVehicles')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          {t('noVehiclesDescription')}
        </p>
        <Button onClick={onAddVehicle} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('addFirstVehicle')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyVehicleState;
