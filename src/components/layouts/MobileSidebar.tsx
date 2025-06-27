
import React from 'react';
import { MobileSidebarVariants, MobileSidebarVariant } from './sidebar/MobileSidebarVariants';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileSidebarProps {
  closeSidebar: () => void;
  variant?: MobileSidebarVariant;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ 
  closeSidebar, 
  variant = 'overlay' 
}) => {
  const isMobile = useIsMobile();
  
  // Use overlay variant for mobile (full screen sidebar)
  const sidebarVariant = isMobile ? 'overlay' : 'overlay';
  
  return (
    <MobileSidebarVariants 
      variant={sidebarVariant} 
      closeSidebar={closeSidebar} 
    />
  );
};

export default MobileSidebar;
