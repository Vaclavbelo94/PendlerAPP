
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { getRouteConfig, isRouteAllowed } from '@/config/routes';

export const useRouteProtection = () => {
  const { user, unifiedUser, isLoading, canAccess } = useUnifiedAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Skip protection while loading
    if (isLoading) return;

    console.log('Route protection check:', { 
      path: location.pathname, 
      user: !!user, 
      unifiedUser: !!unifiedUser,
      isLoading,
      role: unifiedUser?.role,
      hasPremiumAccess: unifiedUser?.hasPremiumAccess
    });

    const currentPath = location.pathname;
    
    // Skip protection for home page completely
    if (currentPath === '/') {
      console.log('Skipping protection for home page');
      return;
    }

    const routeConfig = getRouteConfig(currentPath);

    // Skip protection for public routes
    if (routeConfig?.publicRoute) {
      console.log('Public route, skipping protection');
      return;
    }

    // Handle unauthenticated users
    if (!user || !unifiedUser) {
      const authPages = ['/login', '/register', '/auth'];
      if (!authPages.includes(currentPath)) {
        console.log('User not authenticated, checking route requirements');
        
        // For premium routes, redirect to premium page instead of login
        if (routeConfig?.requiredFeature === 'premium_features') {
          console.log('Redirecting to premium page for premium feature');
          navigate('/premium', { replace: true });
          return;
        }
        
        // For other protected routes, redirect to login
        console.log('Redirecting to login from:', currentPath);
        navigate('/login', { state: { from: location }, replace: true });
      }
      return;
    }

    // Check if route is allowed for current user (only for authenticated users)
    if (!isRouteAllowed(currentPath, unifiedUser.role, canAccess)) {
      console.log('Route not allowed, redirecting. Route config:', routeConfig);
      // Determine appropriate redirect
      if (routeConfig?.requiredFeature === 'premium_features') {
        console.log('Redirecting to premium page');
        navigate('/premium', { replace: true });
      } else if (routeConfig?.requiredRole === 'admin') {
        console.log('Redirecting to unauthorized');
        navigate('/unauthorized', { replace: true });
      } else {
        console.log('Redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, unifiedUser, isLoading, location.pathname, navigate, canAccess]);

  return {
    isAllowed: user && unifiedUser ? isRouteAllowed(location.pathname, unifiedUser.role, canAccess) : location.pathname === '/' || getRouteConfig(location.pathname)?.publicRoute || false,
    isLoading
  };
};
