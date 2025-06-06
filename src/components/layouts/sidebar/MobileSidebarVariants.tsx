
import React from 'react';
import { CompactMobileSidebar } from './CompactMobileSidebar';
import { ModernMobileSidebar } from './ModernMobileSidebar';

export type MobileSidebarVariant = 'compact' | 'full';

interface MobileSidebarVariantsProps {
  variant: MobileSidebarVariant;
  closeSidebar: () => void;
}

export const MobileSidebarVariants: React.FC<MobileSidebarVariantsProps> = ({
  variant,
  closeSidebar
}) => {
  switch (variant) {
    case 'compact':
      return <CompactMobileSidebar closeSidebar={closeSidebar} />;
    case 'full':
      return <ModernMobileSidebar closeSidebar={closeSidebar} />;
    default:
      return <CompactMobileSidebar closeSidebar={closeSidebar} />;
  }
};
