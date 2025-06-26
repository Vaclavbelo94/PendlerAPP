
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDHLRouteGuard } from '@/hooks/dhl/useDHLRouteGuard';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { useOptimizedShiftsManagement } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { useDHLShiftsIntegration } from '@/hooks/shifts/useDHLShiftsIntegration';
import { DHLLayout } from '@/components/dhl/DHLLayout';
import ShiftsMainContainer from '@/components/shifts/ShiftsMainContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Truck } from 'lucide-react';

const DHLShifts: React.FC = () => {
  const { user } = useAuth();
  const { canAccess, isLoading } = useDHLRouteGuard(true);
  const { userAssignment, isLoading: isDHLLoading } = useDHLData(user?.id);
  const { shifts, isLoading: isShiftsLoading } = useOptimizedShiftsManagement(user?.id);
  const { enhancedShifts, dhlStats } = useDHLShiftsIntegration(shifts, userAssignment);

  if (isLoading || isDHLLoading || isShiftsLoading) {
    return (
      <DHLLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Načítám DHL směny...</p>
          </div>
        </div>
      </DHLLayout>
    );
  }

  if (!canAccess) {
    return null;
  }

  return (
    <DHLLayout>
      <div className="space-y-6">
        {/* DHL Stats Card */}
        <Card className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              DHL Přehled směn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{dhlStats.totalShifts}</div>
                <div className="text-sm text-yellow-700">Celkem směn</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{dhlStats.dhlManagedShifts}</div>
                <div className="text-sm text-green-700">DHL generované</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{dhlStats.manualShifts}</div>
                <div className="text-sm text-blue-700">Manuální</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-yellow-800">{dhlStats.dhlPosition}</div>
                <div className="text-xs text-yellow-600">{dhlStats.workGroup}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Shifts Container with DHL context */}
        <ShiftsMainContainer />
      </div>
    </DHLLayout>
  );
};

export default DHLShifts;
