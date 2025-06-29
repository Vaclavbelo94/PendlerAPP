
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyShiftsStateProps {
  onAddShift: () => void;
}

const EmptyShiftsState: React.FC<EmptyShiftsStateProps> = ({ onAddShift }) => {
  const { t } = useTranslation('shifts');

  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('noShifts')}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          {t('noShiftsDescription')}
        </p>
        <Button onClick={onAddShift} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('addFirstShift')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyShiftsState;
