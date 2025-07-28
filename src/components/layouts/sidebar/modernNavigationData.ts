
import {
  Home,
  BarChart3,
  Calendar,
  Car,
  FileText,
  Map,
  Settings,
  Crown,
  Contact,
  HelpCircle,
  Scale,
  Shield,
  Languages,
  Lock,
  FileCheck,
  Building,
  Clock,
  Users
} from 'lucide-react';

export interface ModernNavigationItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  description: string;
  category: 'main' | 'tools' | 'support' | 'admin';
  isPublic?: boolean;
  requiresAuth?: boolean;
  isPremium?: boolean;
  isAdmin?: boolean;
  company?: 'dhl' | 'adecco' | 'randstad';
  color: string;
  gradient: string;
}

export const modernNavigationItems: ModernNavigationItem[] = [
  // Main section
  {
    id: 'home',
    label: 'Domů',
    href: '/',
    icon: Home,
    description: 'Hlavní stránka aplikace',
    category: 'main',
    isPublic: true,
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Přehled vašich aktivit',
    category: 'main',
    requiresAuth: true,
    color: 'text-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  
  // Tools section
  {
    id: 'translator',
    label: 'Překladač',
    href: '/translator',
    icon: Languages,
    description: 'Překládejte texty a fráze',
    category: 'tools',
    isPublic: true,
    color: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'travel',
    label: 'Plánování cest',
    href: '/travel',
    icon: Map,
    description: 'Optimalizace tras a nákladů',
    category: 'tools',
    isPremium: true,
    color: 'text-cyan-600',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'tax-advisor',
    label: 'Daňový poradce',
    href: '/tax-advisor',
    icon: FileText,
    description: 'Profesionální daňové poradenství',
    category: 'tools',
    isPremium: true,
    color: 'text-red-600',
    gradient: 'from-red-500 to-red-600'
  },
  {
    id: 'shifts',
    label: 'Směny',
    href: '/shifts',
    icon: Calendar,
    description: 'Správa pracovních směn',
    category: 'tools',
    isPremium: true,
    color: 'text-pink-600',
    gradient: 'from-pink-500 to-pink-600'
  },
  {
    id: 'vehicle',
    label: 'Vozidlo',
    href: '/vehicle',
    icon: Car,
    description: 'Správa vozidel a nákladů',
    category: 'tools',
    isPremium: true,
    color: 'text-amber-600',
    gradient: 'from-amber-500 to-amber-600'
  },
  {
    id: 'laws',
    label: 'Zákony',
    href: '/laws',
    icon: Scale,
    description: 'Právní předpisy a rady',
    category: 'tools',
    isPublic: true,
    color: 'text-slate-600',
    gradient: 'from-slate-500 to-slate-600'
  },
  
  // Support section
  {
    id: 'premium',
    label: 'Premium',
    href: '/premium',
    icon: Crown,
    description: 'Upgradujte na Premium',
    category: 'support',
    isPublic: true,
    color: 'text-yellow-600',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'contact',
    label: 'Kontakt',
    href: '/contact',
    icon: Contact,
    description: 'Kontaktujte nás',
    category: 'support',
    isPublic: true,
    color: 'text-violet-600',
    gradient: 'from-violet-500 to-violet-600'
  },
  {
    id: 'faq',
    label: 'FAQ',
    href: '/faq',
    icon: HelpCircle,
    description: 'Často kladené otázky',
    category: 'support',
    isPublic: true,
    color: 'text-rose-600',
    gradient: 'from-rose-500 to-rose-600'
  },
  {
    id: 'privacy',
    label: 'Ochrana údajů',
    href: '/privacy',
    icon: Lock,
    description: 'Ochrana osobních údajů',
    category: 'support',
    isPublic: true,
    color: 'text-teal-600',
    gradient: 'from-teal-500 to-teal-600'
  },
  {
    id: 'terms',
    label: 'Podmínky',
    href: '/terms',
    icon: FileCheck,
    description: 'Podmínky použití',
    category: 'support',
    isPublic: true,
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    id: 'settings',
    label: 'Nastavení',
    href: '/settings',
    icon: Settings,
    description: 'Nastavení účtu a aplikace',
    category: 'support',
    requiresAuth: true,
    color: 'text-gray-600',
    gradient: 'from-gray-500 to-gray-600'
  },
  
  // Company-specific sections
  {
    id: 'dhl-hub',
    label: 'DHL Hub',
    href: '/dhl',
    icon: Building,
    description: 'DHL nástroje a funkce',
    category: 'tools',
    requiresAuth: true,
    company: 'dhl',
    color: 'text-yellow-600',
    gradient: 'from-yellow-500 to-red-500'
  },
  {
    id: 'dhl-wechselschicht',
    label: 'Wechselschicht',
    href: '/dhl/wechselschicht',
    icon: Clock,
    description: 'DHL střídavé směny',
    category: 'tools',
    requiresAuth: true,
    company: 'dhl',
    color: 'text-yellow-700',
    gradient: 'from-yellow-600 to-red-600'
  },
  {
    id: 'adecco-hub',
    label: 'Adecco Hub',
    href: '/adecco',
    icon: Users,
    description: 'Adecco nástroje a pozice',
    category: 'tools',
    requiresAuth: true,
    company: 'adecco',
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-700'
  },
  {
    id: 'randstad-hub',
    label: 'Randstad Hub',
    href: '/randstad',
    icon: Building,
    description: 'Randstad flexibilní práce',
    category: 'tools',
    requiresAuth: true,
    company: 'randstad',
    color: 'text-green-600',
    gradient: 'from-green-500 to-green-700'
  },

  // Admin section
  {
    id: 'admin',
    label: 'Administrace',
    href: '/admin',
    icon: Shield,
    description: 'Správa aplikace',
    category: 'admin',
    isAdmin: true,
    color: 'text-red-700',
    gradient: 'from-red-600 to-red-700'
  }
];

export const getCategoryItems = (category: string, userCompany?: string | null) => 
  modernNavigationItems.filter(item => {
    if (item.category !== category) return false;
    if (item.company && item.company !== userCompany) return false;
    return true;
  });

export const getCompanyItems = (userCompany: string | null) =>
  modernNavigationItems.filter(item => item.company === userCompany);

export const getVisibleItems = (userCompany: string | null, isAuth: boolean, isPremium: boolean, isAdmin: boolean) =>
  modernNavigationItems.filter(item => {
    // Company-specific items
    if (item.company && item.company !== userCompany) return false;
    
    // Auth requirements
    if (item.requiresAuth && !isAuth) return false;
    if (item.isPremium && !isPremium) return false;
    if (item.isAdmin && !isAdmin) return false;
    
    return true;
  });

export const getCategoryTitle = (category: string) => {
  switch (category) {
    case 'main': return 'Hlavní';
    case 'tools': return 'Nástroje';
    case 'support': return 'Podpora';
    case 'admin': return 'Administrace';
    default: return '';
  }
};
