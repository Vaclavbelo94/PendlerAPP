
import React, { ReactNode } from 'react';
import Layout from './Layout';
import { NotificationManager } from '@/components/notifications/NotificationManager';
import { ShiftNotifications } from '@/components/notifications/ShiftNotifications';
import { CompactNotificationIndicator } from '@/components/notifications/CompactNotificationIndicator';
import AdminPanelDialog from '@/components/admin/AdminPanelDialog';
import { useAuth } from '@/hooks/useAuth';

interface LayoutWrapperProps {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const { isAdmin } = useAuth();

  const navbarRightContent = (
    <div className="flex items-center gap-1">
      <CompactNotificationIndicator />
      {isAdmin && <AdminPanelDialog />}
    </div>
  );

  return (
    <>
      <NotificationManager />
      <ShiftNotifications />
      <Layout navbarRightContent={navbarRightContent}>
        {children}
      </Layout>
    </>
  );
};

export default LayoutWrapper;
