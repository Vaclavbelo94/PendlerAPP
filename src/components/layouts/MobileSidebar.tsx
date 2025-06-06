
import React from 'react';
import { MobileSidebarVariants, MobileSidebarVariant } from './sidebar/MobileSidebarVariants';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileSidebarProps {
  closeSidebar: () => void;
  variant?: MobileSidebarVariant;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ 
  closeSidebar, 
  variant = 'compact' 
}) => {
  const isMobile = useIsMobile();
  
  // Use compact variant by default for mobile
  const sidebarVariant = isMobile ? variant : 'full';
  
  return (
    <MobileSidebarVariants 
      variant={sidebarVariant} 
      closeSidebar={closeSidebar} 
    />
  );
};

export default MobileSidebar;
