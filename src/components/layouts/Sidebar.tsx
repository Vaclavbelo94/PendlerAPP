
import { useIsMobile } from '@/hooks/use-mobile';
import { ModernSidebar } from './sidebar/ModernSidebar';
import MobileSidebar from './MobileSidebar';

interface SidebarProps {
  closeSidebar?: () => void;
  isLandscapeSheet?: boolean;
  mobileVariant?: 'compact' | 'full';
}

const Sidebar = ({ 
  closeSidebar, 
  isLandscapeSheet = false, 
  mobileVariant = 'compact' 
}: SidebarProps) => {
  const isMobile = useIsMobile();

  // Use mobile sidebar for landscape sheet or mobile devices
  if (isLandscapeSheet || isMobile) {
    return (
      <MobileSidebar 
        closeSidebar={closeSidebar!} 
        variant={mobileVariant}
      />
    );
  }

  return <ModernSidebar closeSidebar={closeSidebar} />;
};

export default Sidebar;
