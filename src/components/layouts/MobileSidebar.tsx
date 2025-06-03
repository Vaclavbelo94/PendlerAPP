
import React from 'react';
import { ModernMobileSidebar } from './sidebar/ModernMobileSidebar';

interface MobileSidebarProps {
  closeSidebar: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ closeSidebar }) => {
  return <ModernMobileSidebar closeSidebar={closeSidebar} />;
};

export default MobileSidebar;
