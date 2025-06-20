
import {
  Home,
  BarChart3,
  Globe,
  Calendar,
  Car,
  FileText,
  Map,
  Settings,
  Crown,
  CreditCard,
  Contact,
  HelpCircle,
  Scale
} from 'lucide-react';
import { NavigationItem } from './types';

export const navigationItems: NavigationItem[] = [
  { label: 'Domů', href: '/', icon: Home, isPublic: true },
  { label: 'Dashboard', href: '/dashboard', icon: BarChart3, requiresAuth: true },
  { label: 'Překladač', href: '/translator', icon: Globe, isPublic: true },
  { label: 'Daňový poradce', href: '/tax-advisor', icon: FileText, isPremium: true },
  { label: 'Směny', href: '/shifts', icon: Calendar, isPremium: true },
  { label: 'Vozidlo', href: '/vehicle', icon: Car, isPremium: true },
  { label: 'Plánování cest', href: '/travel', icon: Map, isPremium: true },
  { label: 'Zákony', href: '/laws', icon: Scale, isPublic: true },
  { label: 'Nastavení', href: '/settings', icon: Settings, requiresAuth: true }
];

export const supportItems: NavigationItem[] = [
  { label: 'Premium', href: '/premium', icon: Crown, isPublic: true },
  { label: 'Ceník', href: '/pricing', icon: CreditCard, isPublic: true },
  { label: 'Kontakt', href: '/contact', icon: Contact, isPublic: true },
  { label: 'FAQ', href: '/faq', icon: HelpCircle, isPublic: true }
];
