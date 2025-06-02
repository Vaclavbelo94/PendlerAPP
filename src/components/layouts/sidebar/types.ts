
import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  isPublic?: boolean;
  requiresAuth?: boolean;
  isPremium?: boolean;
}

export interface MobileSidebarProps {
  closeSidebar?: () => void;
}
