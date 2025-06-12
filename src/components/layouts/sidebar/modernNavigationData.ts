import {
  Home,
  BarChart3,
  GraduationCap,
  Calendar,
  Calculator,
  Car,
  FileText,
  Globe,
  Map,
  Settings,
  Crown,
  Contact,
  HelpCircle,
  Scale,
  Shield,
  Languages
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
    id: 'vocabulary',
    label: 'Výuka němčiny',
    href: '/vocabulary',
    icon: GraduationCap,
    description: 'Slovní zásoba a lekce',
    category: 'tools',
    isPublic: true,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'language',
    label: 'Německé fráze',
    href: '/language',
    icon: Languages,
    description: 'Praktické fráze pro práci',
    category: 'tools',
    isPublic: true,
    color: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'translator',
    label: 'Překladač',
    href: '/translator',
    icon: Languages,
    description: 'Překládejte texty a fráze',
    category: 'tools',
    isPublic: true,
    color: 'text-cyan-600',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'calculator',
    label: 'Kalkulačky',
    href: '/calculator',
    icon: Calculator,
    description: 'Daňové a mzdové kalkulačky',
    category: 'tools',
    isPublic: true,
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600'
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

export const getCategoryItems = (category: string) => 
  modernNavigationItems.filter(item => item.category === category);

export const getCategoryTitle = (category: string) => {
  switch (category) {
    case 'main': return 'Hlavní';
    case 'tools': return 'Nástroje';
    case 'support': return 'Podpora';
    case 'admin': return 'Administrace';
    default: return '';
  }
};
