
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

// Tyto labels budou přeloženy v komponentě pomocí useTranslation
export const navigationItems: NavigationItem[] = [
  { label: 'navigation:home', href: '/', icon: Home, isPublic: true },
  { label: 'navigation:dashboard', href: '/dashboard', icon: BarChart3, requiresAuth: true },
  { label: 'navigation:translator', href: '/translator', icon: Globe, isPublic: true },
  { label: 'navigation:taxAdvisor', href: '/tax-advisor', icon: FileText, isPremium: true },
  { label: 'navigation:shifts', href: '/shifts', icon: Calendar, isPremium: true },
  { label: 'navigation:vehicle', href: '/vehicle', icon: Car, isPremium: true },
  { label: 'navigation:travel', href: '/travel', icon: Map, isPremium: true },
  { label: 'navigation:laws', href: '/laws', icon: Scale, isPublic: true },
  { label: 'navigation:settings', href: '/settings', icon: Settings, requiresAuth: true }
];

export const supportItems: NavigationItem[] = [
  { label: 'navigation:premium', href: '/premium', icon: Crown, isPublic: true },
  { label: 'navigation:pricing', href: '/pricing', icon: CreditCard, isPublic: true },
  { label: 'navigation:contact', href: '/contact', icon: Contact, isPublic: true },
  { label: 'navigation:faq', href: '/faq', icon: HelpCircle, isPublic: true }
];
