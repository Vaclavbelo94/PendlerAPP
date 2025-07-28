import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';
import { useCompanyModuleContext } from '@/components/company/CompanyModuleProvider';

const DHLShiftsWidget: React.FC = () => {
  const { isDHL } = useCompany();
  const { getWidgetConfig } = useCompanyModuleContext();
  
  if (!isDHL) return null;

  const config = getWidgetConfig('dhl_shifts');
  const size = config.size || 'large';

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          DHL Směny
        </CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-xs text-muted-foreground">Tento měsíc</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">3</div>
              <div className="text-xs text-muted-foreground">Zbývající</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Dnes: Ranní směna</span>
              <span className="text-primary font-medium">06:00 - 14:00</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Zítra: Odpolední</span>
              <span className="text-primary font-medium">14:00 - 22:00</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
            <AlertTriangle className="h-3 w-3" />
            <span>Změna času - zítra začátek v 14:30</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DHLShiftsWidget;