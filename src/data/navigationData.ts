
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
  title: string;
  icon: any;
  badge?: number;
  adminOnly?: boolean;
  premium?: boolean;
}

export const navigationItems: NavigationItem[] = [
  {
    path: '/',
    title: 'Domů',
    icon: Home
  },
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: User
  },
  {
    path: '/vehicle',
    title: 'Vozidlo',
    icon: Car
  },
  {
    path: '/vocabulary',
    title: 'Slovníček',
    icon: BookOpen
  },
  {
    path: '/shifts',
    title: 'Směny',
    icon: Calendar
  },
  {
    path: '/translator',
    title: 'Překladač',
    icon: Languages
  },
  {
    path: '/travel',
    title: 'Cestování',
    icon: Map
  },
  {
    path: '/laws',
    title: 'Zákony',
    icon: Scale
  },
  {
    path: '/tax-advisor',
    title: 'Daňový poradce',
    icon: FileText
  },
  {
    path: '/premium',
    title: 'Premium',
    icon: Crown
  },
  {
    path: '/settings',
    title: 'Nastavení',
    icon: Settings
  },
  {
    path: '/admin',
    title: 'Admin',
    icon: Shield,
    adminOnly: true
  }
];
