
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';

interface UserAnalytics {
  userId: string | undefined;
  isAdmin: boolean;
  isPremium: boolean;
}

interface UserAnalyticsWithMethods extends UserAnalytics {
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  trackPageView: (path?: string) => void;
  sessionId: string;
}

export const useUserAnalytics = (): UserAnalyticsWithMethods => {
  const { user, isAdmin, isPremium } = useAuth();
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const [analytics, setAnalytics] = useState<UserAnalytics>({
    userId: user?.id,
    isAdmin: isAdmin,
    isPremium: isPremium,
  });

  useEffect(() => {
    setAnalytics({
      userId: user?.id,
      isAdmin: isAdmin,
      isPremium: isPremium,
    });
  }, [user, isAdmin, isPremium]);

  const trackEvent = (event: string, properties?: Record<string, any>) => {
    console.log('Tracking event:', event, properties);
    // Analytics tracking logic here
  };

  const trackPageView = (path?: string) => {
    console.log('Tracking page view:', path || window.location.pathname);
    // Page view tracking logic here
  };

  return {
    ...analytics,
    trackEvent,
    trackPageView,
    sessionId,
  };
};
