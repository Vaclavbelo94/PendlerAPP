
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CrossBorderCardProps {
  vehicleId?: string;
}

const CrossBorderCard: React.FC<CrossBorderCardProps> = ({ vehicleId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Přeshraniční informace</CardTitle>
        <CardDescription>Informace o přeshraničním používání vozidla</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>Přeshraniční funkce budou dostupné v příští verzi aplikace.</p>
          <p className="text-sm mt-2">Zde budete moci spravovat dokumenty pro přeshraniční dopravu.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrossBorderCard;
