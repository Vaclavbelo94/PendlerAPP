import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayoutV2 } from '@/components/admin/v2/AdminLayoutV2';
import { AdminDashboardV2 } from '@/components/admin/v2/pages/AdminDashboardV2';
import { CompanyManagementV2 } from '@/components/admin/v2/pages/CompanyManagementV2';

const AdminV2: React.FC = () => {
  return (
    <AdminLayoutV2>
      <Routes>
        <Route path="/" element={<AdminDashboardV2 />} />
        <Route path="/companies" element={<CompanyManagementV2 />} />
        <Route path="/accounts" element={<div>Správa účtů - Coming Soon</div>} />
        <Route path="/settings" element={<div>Nastavení webu - Coming Soon</div>} />
        <Route path="/security" element={<div>Bezpečnost - Coming Soon</div>} />
        <Route path="/analytics" element={<div>Analytics - Coming Soon</div>} />
        <Route path="/database" element={<div>Databáze - Coming Soon</div>} />
        <Route path="/monitoring" element={<div>Monitoring - Coming Soon</div>} />
        <Route path="*" element={<Navigate to="/admin/v2" replace />} />
      </Routes>
    </AdminLayoutV2>
  );
};

export default AdminV2;