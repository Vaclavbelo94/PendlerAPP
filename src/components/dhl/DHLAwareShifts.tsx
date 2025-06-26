import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { useOptimizedShiftsManagement } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { useDHLShiftsIntegration } from '@/hooks/shifts/useDHLShiftsIntegration';
import { canAccessDHLFeatures } from '@/utils/dhlAuthUtils';
import { DHLLayout } from './DHLLayout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import Shifts from '@/pages/Shifts';
import Layout from '@/components/layouts/Layout';

const DHLAwareShifts: React.FC = () => {
  const { user } = useAuth();
  const isDHLUser = canAccessDHLFeatures(user);
  
  const { userAssignment, isLoading: isDHLLoading } = useDHLData(user?.id);
  const { shifts, isLoading: isShiftsLoading } = useOptimizedShiftsManagement(user?.id);
  const { enhancedShifts, dhlStats } = useDHLShiftsIntegration(shifts, userAssignment);

  // If user has DHL access and assignment, use DHL layout
  if (isDHLUser && userAssignment) {
    return (
      <DHLLayout navbarRightContent={<NavbarRightContent />}>
        <DHLShiftsContent 
          shifts={enhancedShifts}
          dhlStats={dhlStats}
          isLoading={isShiftsLoading || isDHLLoading}
        />
      </DHLLayout>
    );
  }

  // Otherwise use standard layout
  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Shifts />
    </Layout>
  );
};

const DHLShiftsContent: React.FC<{
  shifts: any[];
  dhlStats: any;
  isLoading: boolean;
}> = ({ shifts, dhlStats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Načítám DHL směny...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* DHL Stats Card */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-lg p-6 border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">DHL Přehled směn</h3>
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
      </div>

      {/* Regular Shifts Component with DHL data */}
      <Shifts />
    </div>
  );
};

export default DHLAwareShifts;
