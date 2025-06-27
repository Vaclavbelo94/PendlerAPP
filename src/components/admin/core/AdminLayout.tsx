
import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminProvider } from './AdminProvider';
import { AdminErrorBoundary } from './AdminErrorBoundary';
import { useAuth } from '@/hooks/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { unifiedUser } = useAuth();

  if (!unifiedUser?.isAdmin) {
    return null;
  }

  return (
    <AdminErrorBoundary>
      <AdminProvider>
        <div className="min-h-screen bg-background">
          <div className="flex h-screen w-full">
            {/* Sidebar */}
            <AdminSidebar />
            
            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <AdminHeader />
              <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <AdminErrorBoundary onReset={() => window.location.reload()}>
                  {children}
                </AdminErrorBoundary>
              </main>
            </div>
          </div>
        </div>
      </AdminProvider>
    </AdminErrorBoundary>
  );
};
