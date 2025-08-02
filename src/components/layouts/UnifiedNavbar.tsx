
import React from 'react';
import { UnifiedMobileNavbar } from '@/components/mobile/UnifiedMobileNavbar';


interface UnifiedNavbarProps {
  rightContent?: React.ReactNode;
}

const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({ rightContent }) => {
  return <UnifiedMobileNavbar rightContent={rightContent} />;
};

export default UnifiedNavbar;
