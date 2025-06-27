
import React from 'react';
import { CompactMobileSidebar } from './CompactMobileSidebar';
import { ModernMobileSidebar } from './ModernMobileSidebar';

export type MobileSidebarVariant = 'compact' | 'full' | 'overlay';

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
      return <CompactMobileSidebar isOpen={true} onClose={closeSidebar} />;
    case 'full':
      return <ModernMobileSidebar isOpen={true} onClose={closeSidebar} />;
    case 'overlay':
    default:
      return <ModernMobileSidebar isOpen={true} onClose={closeSidebar} />;
  }
};
