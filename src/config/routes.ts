
import { UserRole } from '@/contexts/UnifiedAuthContext';

export interface RouteConfig {
  path: string;
  publicRoute?: boolean;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  requiredFeature?: string;
  redirectTo?: string;
}

export const routeConfigs: Record<string, RouteConfig> = {
  // Public routes
  '/': { path: '/', publicRoute: true },
  '/about': { path: '/about', publicRoute: true },
  '/contact': { path: '/contact', publicRoute: true },
  '/features': { path: '/features', publicRoute: true },
  '/pricing': { path: '/pricing', publicRoute: true },
  '/login': { path: '/login', publicRoute: true },
  '/register': { path: '/register', publicRoute: true },
  
  // Protected routes
  '/dashboard': { 
    path: '/dashboard',
    allowedRoles: ['standard', 'premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/profile': { 
    path: '/profile',
    allowedRoles: ['standard', 'premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/profile-extended': { 
    path: '/profile-extended',
    allowedRoles: ['standard', 'premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/settings': { 
    path: '/settings',
    allowedRoles: ['standard', 'premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  
  // Premium features
  '/shifts': { 
    path: '/shifts',
    requiredFeature: 'premium_features',
    allowedRoles: ['premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/vehicle': { 
    path: '/vehicle',
    requiredFeature: 'premium_features',
    allowedRoles: ['premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/analytics': { 
    path: '/analytics',
    requiredFeature: 'premium_features',
    allowedRoles: ['premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/travel': { 
    path: '/travel',
    requiredFeature: 'premium_features',
    allowedRoles: ['premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/tax-advisor': { 
    path: '/tax-advisor',
    requiredFeature: 'premium_features',
    allowedRoles: ['premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  
  // DHL specific routes
  '/dhl-setup': { 
    path: '/dhl-setup',
    allowedRoles: ['dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/dhl-admin': { 
    path: '/dhl-admin',
    requiredRole: 'dhl_admin' 
  },
  
  // Admin routes
  '/admin': { 
    path: '/admin',
    requiredRole: 'admin' 
  },
  
  // Public tools
  '/translator': { 
    path: '/translator',
    allowedRoles: ['standard', 'premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/laws': { 
    path: '/laws',
    allowedRoles: ['standard', 'premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  
  // Premium access page
  '/premium': { 
    path: '/premium',
    allowedRoles: ['standard', 'premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  }
};

export const getRouteConfig = (path: string): RouteConfig | null => {
  return routeConfigs[path] || null;
};

export const isRouteAllowed = (
  path: string, 
  userRole?: UserRole, 
  canAccessFeature?: (feature: string) => boolean
): boolean => {
  const config = getRouteConfig(path);
  
  if (!config) return true; // Unknown routes are allowed by default
  if (config.publicRoute) return true;
  if (!userRole) return false;
  
  // Check role requirements
  if (config.requiredRole && userRole !== config.requiredRole && userRole !== 'admin') {
    return false;
  }
  
  // Check allowed roles
  if (config.allowedRoles && !config.allowedRoles.includes(userRole) && userRole !== 'admin') {
    return false;
  }
  
  // Check feature requirements
  if (config.requiredFeature && canAccessFeature && !canAccessFeature(config.requiredFeature)) {
    return false;
  }
  
  return true;
};
