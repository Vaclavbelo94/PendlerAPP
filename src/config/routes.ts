
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
  '/': { publicRoute: true },
  '/about': { publicRoute: true },
  '/contact': { publicRoute: true },
  '/features': { publicRoute: true },
  '/pricing': { publicRoute: true },
  '/login': { publicRoute: true },
  '/register': { publicRoute: true },
  
  // Protected routes
  '/dashboard': { 
    allowedRoles: ['standard', 'premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/profile': { 
    allowedRoles: ['standard', 'premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/profile-extended': { 
    allowedRoles: ['standard', 'premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/settings': { 
    allowedRoles: ['standard', 'premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  
  // Premium features
  '/shifts': { 
    requiredFeature: 'premium_features',
    allowedRoles: ['premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/vehicle': { 
    requiredFeature: 'premium_features',
    allowedRoles: ['premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/analytics': { 
    requiredFeature: 'premium_features',
    allowedRoles: ['premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/travel': { 
    requiredFeature: 'premium_features',
    allowedRoles: ['premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/tax-advisor': { 
    requiredFeature: 'premium_features',
    allowedRoles: ['premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  
  // DHL specific routes
  '/dhl-setup': { 
    allowedRoles: ['dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/dhl-admin': { 
    requiredRole: 'dhl_admin' 
  },
  
  // Admin routes
  '/admin': { 
    requiredRole: 'admin' 
  },
  
  // Public tools
  '/translator': { 
    allowedRoles: ['standard', 'premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  '/laws': { 
    allowedRoles: ['standard', 'premium', 'dhl_employee', 'dhl_admin', 'admin'] 
  },
  
  // Premium access page
  '/premium': { 
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
