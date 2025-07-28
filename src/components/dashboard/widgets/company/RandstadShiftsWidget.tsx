import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Zap, TrendingUp } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';
import { useCompanyModuleContext } from '@/components/company/CompanyModuleProvider';

const RandstadShiftsWidget: React.FC = () => {
  const { isRandstad } = useCompany();
  const { getWidgetConfig } = useCompanyModuleContext();
  
  if (!isRandstad) return null;

  const config = getWidgetConfig('randstad_shifts');

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Randstad Směny
        </CardTitle>
        <Zap className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">15</div>
              <div className="text-xs text-muted-foreground">Flexibilní směny</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">7</div>
              <div className="text-xs text-muted-foreground">Volitelné</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Nejbližší směna</span>
              <span className="text-primary font-medium">Zítra 09:00</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Týdenní cíl</span>
              <span className="text-green-600 font-medium">32/40h</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
            <TrendingUp className="h-3 w-3" />
            <span>+2 nové příležitosti k dispozici</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RandstadShiftsWidget;