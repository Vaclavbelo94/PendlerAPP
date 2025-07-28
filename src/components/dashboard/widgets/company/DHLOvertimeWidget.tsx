import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Sun, Sunset, Moon } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';
import { useCompanyModuleContext } from '@/components/company/CompanyModuleProvider';

const DHLOvertimeWidget: React.FC = () => {
  const { isDHL } = useCompany();
  const { getWidgetConfig } = useCompanyModuleContext();
  
  if (!isDHL) return null;

  const config = getWidgetConfig('dhl_overtime');

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Přesčasy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-yellow-50 rounded">
              <Sun className="h-4 w-4 mx-auto mb-1 text-yellow-600" />
              <div className="text-lg font-bold text-yellow-700">8h</div>
              <div className="text-xs text-yellow-600">Ranní</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded">
              <Sunset className="h-4 w-4 mx-auto mb-1 text-orange-600" />
              <div className="text-lg font-bold text-orange-700">12h</div>
              <div className="text-xs text-orange-600">Odpolední</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <Moon className="h-4 w-4 mx-auto mb-1 text-blue-600" />
              <div className="text-lg font-bold text-blue-700">4h</div>
              <div className="text-xs text-blue-600">Noční</div>
            </div>
          </div>
          
          <div className="text-center pt-2 border-t">
            <div className="text-2xl font-bold text-primary">24h</div>
            <div className="text-xs text-muted-foreground">Celkem tento měsíc</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DHLOvertimeWidget;