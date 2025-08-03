import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayoutV2 } from '@/components/admin/v2/AdminLayoutV2';
import { AdminDashboardV2 } from '@/components/admin/v2/pages/AdminDashboardV2';
import { CompanyManagementV2 } from '@/components/admin/v2/pages/CompanyManagementV2';
import { AccountManagementV2 } from '@/components/admin/v2/pages/AccountManagementV2';
import { WebSettingsV2 } from '@/components/admin/v2/pages/WebSettingsV2';
import { SecurityV2 } from '@/components/admin/v2/pages/SecurityV2';
import { AnalyticsV2 } from '@/components/admin/v2/pages/AnalyticsV2';
import { DatabaseV2 } from '@/components/admin/v2/pages/DatabaseV2';
import { MonitoringV2 } from '@/components/admin/v2/pages/MonitoringV2';
import { CompanyPremiumCodesV2 } from '@/components/admin/v2/pages/CompanyPremiumCodesV2';

const AdminV2: React.FC = () => {
  return (
    <AdminLayoutV2>
      <Routes>
        <Route path="/" element={<AdminDashboardV2 />} />
        <Route path="/companies" element={<CompanyManagementV2 />} />
        <Route path="/premium-codes" element={<CompanyPremiumCodesV2 />} />
        <Route path="/accounts" element={<AccountManagementV2 />} />
        <Route path="/settings" element={<WebSettingsV2 />} />
        <Route path="/security" element={<SecurityV2 />} />
        <Route path="/analytics" element={<AnalyticsV2 />} />
        <Route path="/database" element={<DatabaseV2 />} />
        <Route path="/monitoring" element={<MonitoringV2 />} />
        <Route path="*" element={<Navigate to="/admin/v2" replace />} />
      </Routes>
    </AdminLayoutV2>
  );
};

export default AdminV2;