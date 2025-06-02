
import React from 'react';
import Layout from './Layout';
import { GlobalScrollToTop } from '@/components/common/GlobalScrollToTop';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <>
      <Layout>
        {children}
      </Layout>
      <GlobalScrollToTop />
    </>
  );
};

export default LayoutWrapper;
