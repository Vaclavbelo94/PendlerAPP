
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { canAccessDHLFeatures } from '@/utils/dhlAuthUtils';
import Logo from '@/components/ui/design-system/Logo';

const SidebarLogo: React.FC<{ closeSidebar: () => void }> = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation('navigation');
  
  // Determine if we should use DHL home
  const canAccessDHL = canAccessDHLFeatures(user);
  const isDHLRoute = location.pathname.startsWith('/dhl-');
  const shouldUseDHLHome = canAccessDHL && isDHLRoute;
  
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
  
  const homeLink = shouldUseDHLHome ? '/dhl-dashboard' : '/';
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <Logo 
        size="lg" 
        variant="full" 
        onClick={() => handleNavigate(homeLink)()} 
        className="cursor-pointer" 
        showTagline={false}
        animated={true}
      />
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          {shouldUseDHLHome ? 'DHL Workspace' : t('czechWorkersHelper')}
        </p>
      </div>
    </div>
  );
};

export default SidebarLogo;
