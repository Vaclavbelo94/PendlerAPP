
import { 
  Home, 
  User, 
  Car, 
  BookOpen, 
  Calendar, 
  Languages, 
  Settings, 
  Crown, 
  Shield,
  Map,
  Scale,
  FileText,
  Truck
} from 'lucide-react';

export interface NavigationItem {
  path: string;
  titleKey: string; // Changed from title to titleKey for translation
  icon: any;
  badge?: number;
  adminOnly?: boolean;
  premium?: boolean;
  dhlOnly?: boolean; // New DHL-specific flag
  dhlAdminOnly?: boolean; // New DHL admin-specific flag
}

export const navigationItems: NavigationItem[] = [
  {
    path: '/',
    titleKey: 'home',
    icon: Home
  },
  {
    path: '/dashboard',
    titleKey: 'dashboard',
    icon: User
  },
  {
    path: '/vehicle',
    titleKey: 'vehicle',
    icon: Car
  },
  {
    path: '/translator',
    titleKey: 'translator',
    icon: Languages
  },
  {
    path: '/shifts',
    titleKey: 'shifts',
    icon: Calendar
  },
  {
    path: '/travel',
    titleKey: 'travel',
    icon: Map
  },
  {
    path: '/laws',
    titleKey: 'laws',
    icon: Scale
  },
  {
    path: '/tax-advisor',
    titleKey: 'taxAdvisor',
    icon: FileText
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
  },
  {
    path: '/admin',
    titleKey: 'admin',
    icon: Shield,
    adminOnly: true
  },
  // DHL specific navigation items - redirect DHL dashboard to main dashboard
  {
    path: '/dhl-admin',
    titleKey: 'dhlAdmin',
    icon: Truck,
    dhlAdminOnly: true
  },
  {
    path: '/dashboard', // Redirect DHL dashboard to main dashboard
    titleKey: 'dhlDashboard',
    icon: Truck,
    dhlOnly: true
  }
];
