
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { getRouteConfig, isRouteAllowed } from '@/config/routes';

export const useRouteProtection = () => {
  const { user, unifiedUser, isLoading, canAccess } = useUnifiedAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    const currentPath = location.pathname;
    const routeConfig = getRouteConfig(currentPath);

    // Skip protection for public routes
    if (routeConfig?.publicRoute) return;

    // Redirect to login if not authenticated
    if (!user || !unifiedUser) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    // Check if route is allowed for current user
    if (!isRouteAllowed(currentPath, unifiedUser.role, canAccess)) {
      // Determine appropriate redirect
      if (routeConfig?.requiredFeature === 'premium_features') {
        navigate('/premium', { replace: true });
      } else if (routeConfig?.requiredRole === 'admin') {
        navigate('/unauthorized', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, unifiedUser, isLoading, location, navigate, canAccess]);

  return {
    isAllowed: user && unifiedUser ? isRouteAllowed(location.pathname, unifiedUser.role, canAccess) : false,
    isLoading
  };
};
