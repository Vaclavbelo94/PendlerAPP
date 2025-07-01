
import { 
  LayoutDashboard, 
  Calendar, 
  Calculator, 
  FileText, 
  Car, 
  Users, 
  BarChart3, 
  Settings, 
  Crown,
  Building2,
  Shield,
  Languages,
  Scale,
  Plane
} from 'lucide-react';

export interface NavigationItem {
  path: string;
  titleKey: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  premium?: boolean;
  adminOnly?: boolean;
  dhlOnly?: boolean;
  dhlAdminOnly?: boolean;
}

export const navigationItems: NavigationItem[] = [
  {
    path: '/dashboard',
    titleKey: 'dashboard',
    icon: LayoutDashboard
  },
  {
    path: '/shifts',
    titleKey: 'shifts',
    icon: Calendar,
    premium: true
  },
  {
    path: '/vehicle',
    titleKey: 'vehicles',
    icon: Car,
    premium: true
  },
  {
    path: '/travel',
    titleKey: 'travel',
    icon: Plane,
    premium: true
  },
  {
    path: '/calculator',
    titleKey: 'calculator',
    icon: Calculator
  },
  {
    path: '/tax-advisor',
    titleKey: 'tax_advisor',
    icon: FileText,
    premium: true
  },
  {
    path: '/analytics',
    titleKey: 'analytics',
    icon: BarChart3,
    premium: true
  },
  {
    path: '/translator',
    titleKey: 'hr_communication',
    icon: Languages
  },
  {
    path: '/laws',
    titleKey: 'laws',
    icon: Scale
  },
  {
    path: '/dhl-setup',
    titleKey: 'dhl_setup',
    icon: Building2,
    dhlOnly: true
  },
  {
    path: '/admin',
    titleKey: 'admin',
    icon: Shield,
    adminOnly: true
  },
  {
    path: '/premium',
    titleKey: 'premium',
    icon: Crown
  },
  {
    path: '/settings',
    titleKey: 'settings',
    icon: Settings
  }
];
