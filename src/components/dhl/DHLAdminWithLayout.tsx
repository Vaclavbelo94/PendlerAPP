
import React from 'react';
import { DHLLayout } from './DHLLayout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import DHLAdmin from '@/pages/DHLAdmin';

const DHLAdminWithLayout: React.FC = () => {
  return (
    <DHLLayout navbarRightContent={<NavbarRightContent />}>
      <DHLAdmin />
    </DHLLayout>
  );
};

export default DHLAdminWithLayout;
