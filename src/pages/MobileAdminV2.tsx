import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MobileAdminLayout } from '@/components/admin/mobile/MobileAdminLayout';
import { MobileAdminDashboard } from '@/components/admin/mobile/pages/MobileAdminDashboard';
import { MobileUserManagement } from '@/components/admin/mobile/pages/MobileUserManagement';
import { MobileCompanyManagement } from '@/components/admin/mobile/pages/MobileCompanyManagement';
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
        <Route path="/analytics" element={<div>Analytics - Coming Soon</div>} />
        <Route path="/security" element={<div>Security - Coming Soon</div>} />
        <Route path="/premium-codes" element={<div>Premium Codes - Coming Soon</div>} />
        <Route path="/monitoring" element={<div>Monitoring - Coming Soon</div>} />
        <Route path="/database" element={<div>Database - Coming Soon</div>} />
        <Route path="/settings" element={<div>Settings - Coming Soon</div>} />
        <Route path="*" element={<Navigate to="/admin/mobile" replace />} />
      </Routes>
    </MobileAdminLayout>
  );
};

export default MobileAdminV2;