
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '@/components/ui/design-system/Logo';

const SidebarLogo: React.FC<{ closeSidebar: () => void }> = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('navigation');
  
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
    <div className="flex flex-col items-center space-y-2">
      <Logo 
        size="lg" 
        variant="full" 
        onClick={() => handleNavigate("/")()} 
        className="cursor-pointer" 
        showTagline={false}
        animated={true}
      />
      <div className="text-center">
        <p className="text-xs text-muted-foreground">{t('czechWorkersHelper')}</p>
      </div>
    </div>
  );
};

export default SidebarLogo;
