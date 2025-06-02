
import React from 'react';
import Layout from './Layout';
import { AdProvider } from '@/components/ads/AdProvider';
import { AdPopup } from '@/components/ads/AdPopup';

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
    </AdProvider>
  );
};

export default LayoutWrapper;
