
import { useIsMobile } from '@/hooks/use-mobile';
import { ModernSidebar } from './sidebar/ModernSidebar';
import { ModernMobileSidebar } from './sidebar/ModernMobileSidebar';

interface SidebarProps {
  closeSidebar?: () => void;
  isLandscapeSheet?: boolean;
}

const Sidebar = ({ closeSidebar, isLandscapeSheet = false }: SidebarProps) => {
  const isMobile = useIsMobile();

  // Use mobile sidebar for landscape sheet or mobile devices
  if (isLandscapeSheet || isMobile) {
    return <ModernMobileSidebar closeSidebar={closeSidebar!} />;
  }

  return <ModernSidebar closeSidebar={closeSidebar} />;
};

export default Sidebar;
