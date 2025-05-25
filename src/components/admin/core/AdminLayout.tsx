
import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminProvider } from './AdminProvider';
import { useAuth } from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminProvider>
      <div className="min-h-screen bg-background">
        <div className="flex h-screen">
          {/* Sidebar */}
          <AdminSidebar />
          
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminProvider>
  );
};
