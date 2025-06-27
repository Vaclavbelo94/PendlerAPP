
import React from 'react';
import { Outlet } from 'react-router-dom';
import ModernNavbar from './ModernNavbar';

const ModernLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default ModernLayout;
