import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MobileAdminLayout } from '@/components/admin/mobile/MobileAdminLayout';
import { MobileAdminDashboard } from '@/components/admin/mobile/pages/MobileAdminDashboard';
import { MobileUserManagement } from '@/components/admin/mobile/pages/MobileUserManagement';
import { MobileCompanyManagement } from '@/components/admin/mobile/pages/MobileCompanyManagement';
import { MobileAnalytics } from '@/components/admin/mobile/pages/MobileAnalytics';
import { MobileSecurity } from '@/components/admin/mobile/pages/MobileSecurity';
import { MobilePremiumCodes } from '@/components/admin/mobile/pages/MobilePremiumCodes';
import { MobileMonitoring } from '@/components/admin/mobile/pages/MobileMonitoring';
import { MobileSettings } from '@/components/admin/mobile/pages/MobileSettings';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileAdminV2: React.FC = () => {
  const isMobile = useIsMobile();

  // Redirect desktop users to desktop admin
  if (!isMobile) {
    return <Navigate to="/admin/v2" replace />;
  }

  return (
    <MobileAdminLayout>
      <Routes>
        <Route path="/" element={<MobileAdminDashboard />} />
        <Route path="/users" element={<MobileUserManagement />} />
        <Route path="/companies" element={<MobileCompanyManagement />} />
        <Route path="/analytics" element={<MobileAnalytics />} />
        <Route path="/security" element={<MobileSecurity />} />
        <Route path="/premium-codes" element={<MobilePremiumCodes />} />
        <Route path="/monitoring" element={<MobileMonitoring />} />
        <Route path="/database" element={<div>Database - Coming Soon</div>} />
        <Route path="/settings" element={<MobileSettings />} />
        <Route path="*" element={<Navigate to="/admin/mobile" replace />} />
      </Routes>
    </MobileAdminLayout>
  );
};

export default MobileAdminV2;