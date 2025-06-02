
import React from 'react';
import Layout from './Layout';
import { AdProvider } from '@/components/ads/AdProvider';
import { AdPopup } from '@/components/ads/AdPopup';
import { GlobalScrollToTop } from '@/components/common/GlobalScrollToTop';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <AdProvider>
      <Layout>
        {children}
      </Layout>
      <AdPopup trigger={5} />
      <GlobalScrollToTop />
    </AdProvider>
  );
};

export default LayoutWrapper;
