import { useMemo } from 'react';
import { useAuth } from '@/hooks/auth';
import { useCompanyMenuItems } from '@/hooks/useCompanyMenuItems';
import { useTranslation } from 'react-i18next';
import { UserRole } from '@/types/auth';

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  route: string;
  requiresAuth?: boolean;
  requiredRole?: UserRole;
}

const getBaseMenuItems = (t: any): MenuItem[] => [
  {
    id: 'home',
    title: t('home'),
    icon: 'Home',
    route: '/'
  },
  {
    id: 'pricing',
    title: t('pricing'),
    icon: 'CreditCard',
    route: '/pricing'
  },
  {
    id: 'contact',
    title: t('contact'),
    icon: 'Mail',
    route: '/contact'
  },
  {
    id: 'faq',
    title: t('faq'),
    icon: 'HelpCircle',
    route: '/faq'
  }
];

const getAuthenticatedMenuItems = (t: any): MenuItem[] => [
  {
    id: 'dashboard',
    title: t('dashboard'),
    icon: 'LayoutDashboard',
    route: '/dashboard',
    requiresAuth: true
  },
  {
    id: 'shifts',
    title: t('shifts'),
    icon: 'Calendar',
    route: '/shifts',
    requiresAuth: true
  },
  {
    id: 'travel',
    title: t('travel'),
    icon: 'MapPin',
    route: '/travel',
    requiresAuth: true
  },
  {
    id: 'profile',
    title: t('profile'),
    icon: 'User',
    route: '/profile',
    requiresAuth: true
  },
  {
    id: 'settings',
    title: t('settings'),
    icon: 'Settings',
    route: '/settings',
    requiresAuth: true
  }
];

const getPremiumMenuItems = (t: any): MenuItem[] => [
  {
    id: 'translator',
    title: t('translator'),
    icon: 'Languages',
    route: '/translator',
    requiresAuth: true,
    requiredRole: UserRole.PREMIUM
  },
  {
    id: 'taxAdvisor',
    title: t('taxAdvisor'),
    icon: 'Calculator',
    route: '/tax-advisor',
    requiresAuth: true,
    requiredRole: UserRole.PREMIUM
  },
  {
    id: 'laws',
    title: t('laws'),
    icon: 'BookOpen',
    route: '/laws',
    requiresAuth: true,
    requiredRole: UserRole.PREMIUM
  }
];

const getAdminMenuItems = (t: any): MenuItem[] => [
  {
    id: 'admin',
    title: 'Admin Panel',
    icon: 'Shield',
    route: '/admin',
    requiresAuth: true,
    requiredRole: UserRole.ADMIN
  },
  {
    id: 'users',
    title: 'Správa uživatelů',
    icon: 'Users',
    route: '/admin/users',
    requiresAuth: true,
    requiredRole: UserRole.ADMIN
  }
];

export const useMobileMenuData = () => {
  const { user, unifiedUser, isPremium, isAdmin } = useAuth();
  const { localizedMenuItems, isLoading: companyMenuLoading } = useCompanyMenuItems();
  const { t } = useTranslation('navigation');

  const menuSections = useMemo((): MenuSection[] => {
    const sections: MenuSection[] = [];

    // Company-specific menu (priority)
    if (user && unifiedUser?.company && localizedMenuItems.length > 0) {
      sections.push({
        title: `${unifiedUser.company.toUpperCase()} Menu`,
        items: localizedMenuItems.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          icon: item.icon,
          route: item.route,
          requiresAuth: true
        }))
      });
    }

    // Admin menu
    if (isAdmin) {
      sections.push({
        title: 'Administrace',
        items: getAdminMenuItems(t)
      });
    }

    // Premium features
    if (isPremium && user) {
      sections.push({
        title: 'Premium funkce',
        items: getPremiumMenuItems(t)
      });
    }

    // Basic authenticated menu
    if (user) {
      sections.push({
        title: 'Aplikace',
        items: getAuthenticatedMenuItems(t)
      });
    }

    // Always show base menu
    sections.push({
      title: user ? 'Obecné' : 'Menu',
      items: getBaseMenuItems(t)
    });

    return sections;
  }, [user, unifiedUser, isPremium, isAdmin, localizedMenuItems, t]);

  return {
    menuSections,
    isLoading: companyMenuLoading,
    hasCompanyMenu: !!(user && unifiedUser?.company && localizedMenuItems.length > 0),
    userInfo: unifiedUser ? {
      email: unifiedUser.email,
      role: unifiedUser.role,
      company: unifiedUser.company,
      isPremium: unifiedUser.isPremium,
      isAdmin: unifiedUser.isAdmin
    } : null
  };
};