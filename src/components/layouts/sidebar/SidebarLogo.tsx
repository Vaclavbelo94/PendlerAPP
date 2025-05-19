
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/design-system/Logo';

const SidebarLogo: React.FC<{ closeSidebar: () => void }> = ({ closeSidebar }) => {
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    navigate(path);
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      closeSidebar();
    }
  };
  
  return (
    <Logo 
      size="lg" 
      variant="full" 
      onClick={() => handleNavigate("/")()} 
      className="cursor-pointer" 
      showTagline={true}
      animated={true}
    />
  );
};

export default SidebarLogo;
