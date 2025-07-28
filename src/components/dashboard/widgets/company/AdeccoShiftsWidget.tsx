import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';
import { useCompanyModuleContext } from '@/components/company/CompanyModuleProvider';

const AdeccoShiftsWidget: React.FC = () => {
  const { isAdecco } = useCompany();
  const { getWidgetConfig } = useCompanyModuleContext();
  
  if (!isAdecco) return null;

  const config = getWidgetConfig('adecco_shifts');

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Adecco Směny
        </CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">8</div>
              <div className="text-xs text-muted-foreground">Přiřazené směny</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">5</div>
              <div className="text-xs text-muted-foreground">Dostupné pozice</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Skladník - Praha
              </span>
              <span className="text-primary font-medium">Zítra</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Operátor - Brno
              </span>
              <span className="text-primary font-medium">Středa</span>
            </div>
          </div>

          <div className="text-center pt-2 border-t">
            <div className="text-sm text-green-600">
              ✓ Rating: 4.8/5 (156 hodnocení)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdeccoShiftsWidget;