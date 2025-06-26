
import React from 'react';
import { DHLLayout } from './DHLLayout';
import DHLAdmin from '@/pages/DHLAdmin';

const DHLAdminWithLayout: React.FC = () => {
  return (
    <DHLLayout>
      <DHLAdmin />
    </DHLLayout>
  );
};

export default DHLAdminWithLayout;
