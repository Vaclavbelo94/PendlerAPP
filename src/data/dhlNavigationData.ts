
import { 
  Home, 
  Calendar, 
  Settings, 
  User,
  Truck,
  FileText,
  BarChart3,
  Users
} from 'lucide-react';

export interface DHLNavigationItem {
  path: string;
  titleKey: string;
  title: string; // Direct title for DHL items
  icon: any;
  badge?: number;
  adminOnly?: boolean;
  dhlOnly?: boolean; // Added missing property
  dhlAdminOnly?: boolean; // Added missing property
}

export const dhlNavigationItems: DHLNavigationItem[] = [
  {
    path: '/dhl-dashboard',
    titleKey: 'dhlDashboard',
    title: 'DHL Dashboard',
    icon: Home
  },
  {
    path: '/shifts',
    titleKey: 'shifts',
    title: 'Směny',
    icon: Calendar
  },
  {
    path: '/profile',
    titleKey: 'profile',
    title: 'Profil',
    icon: User
  },
  {
    path: '/settings',
    titleKey: 'settings',
    title: 'Nastavení',
    icon: Settings
  }
];

export const dhlAdminNavigationItems: DHLNavigationItem[] = [
  {
    path: '/dhl-admin',
    titleKey: 'dhlAdmin',
    title: 'DHL Admin',
    icon: Truck,
    dhlAdminOnly: true
  },
  {
    path: '/dhl-dashboard',
    titleKey: 'dhlDashboard',
    title: 'DHL Dashboard',
    icon: BarChart3
  },
  {
    path: '/shifts',
    titleKey: 'shifts',
    title: 'Směny',
    icon: Calendar
  },
  {
    path: '/profile',
    titleKey: 'profile',
    title: 'Profil',
    icon: User
  },
  {
    path: '/settings',
    titleKey: 'settings',
    title: 'Nastavení',
    icon: Settings
  }
];
