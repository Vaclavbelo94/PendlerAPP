import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { useOptimizedShiftsManagement } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { useDHLShiftsIntegration } from '@/hooks/shifts/useDHLShiftsIntegration';
import { canAccessDHLFeatures } from '@/utils/dhlAuthUtils';
import { DHLLayout } from './DHLLayout';
import Layout from '@/components/layouts/Layout';
import ShiftsMainContainer from '@/components/shifts/ShiftsMainContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DHLAwareShifts: React.FC = () => {
  const { user } = useAuth();
  const isDHLUser = canAccessDHLFeatures(user);
  
  const { userAssignment, isLoading: isDHLLoading } = useDHLData(user?.id);
  const { shifts, isLoading: isShiftsLoading } = useOptimizedShiftsManagement(user?.id);
  const { enhancedShifts, dhlStats } = useDHLShiftsIntegration(shifts, userAssignment);

  // If user has DHL access and assignment, use DHL layout with enhanced stats
  if (isDHLUser && userAssignment) {
    return (
      <DHLLayout>
        <div className="space-y-6">
          {/* DHL Stats Card */}
          <Card className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-yellow-800">
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

          {/* Main Shifts Container with DHL data */}
          <ShiftsMainContainer />
        </div>
      </DHLLayout>
    );
  }

  // Otherwise use standard layout
  return (
    <Layout>
      <ShiftsMainContainer />
    </Layout>
  );
};

export default DHLAwareShifts;
