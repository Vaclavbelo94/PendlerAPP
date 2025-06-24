
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
  FileText
} from 'lucide-react';

export interface NavigationItem {
  path: string;
  titleKey: string; // Changed from title to titleKey for translation
  icon: any;
  badge?: number;
  adminOnly?: boolean;
  premium?: boolean;
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
  }
];
