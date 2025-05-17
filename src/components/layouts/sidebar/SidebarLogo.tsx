
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div onClick={handleNavigate("/")} className="flex items-center space-x-2 cursor-pointer">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
        PH
      </div>
      <span className="font-poppins font-bold text-lg">Pendler Helper</span>
    </div>
  );
};

export default SidebarLogo;
