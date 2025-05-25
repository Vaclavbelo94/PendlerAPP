
import { useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private userId: string | null = null;
  
  init(userId: string) {
    this.userId = userId;
    this.flush(); // Send any queued events
  }
  
  track(name: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name,
      properties: {
        ...properties,
        userId: this.userId,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    };
    
    this.events.push(event);
    
    // Auto-flush if queue gets too large
    if (this.events.length >= 10) {
      this.flush();
    }
  }
  
  private flush() {
    if (this.events.length === 0) return;
    
    // In production, send to analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics events:', this.events);
    }
    
    // Clear events after sending
    this.events = [];
  }
  
  // Track page views
  trackPageView(page: string) {
    this.track('page_view', { page });
  }
  
  // Track user actions
  trackAction(action: string, details?: Record<string, any>) {
    this.track('user_action', { action, ...details });
  }
  
  // Track errors
  trackError(error: Error, context?: Record<string, any>) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      ...context
    });
  }
}

const analytics = new AnalyticsService();

export const useAnalytics = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.id) {
      analytics.init(user.id);
    }
  }, [user]);
  
  const trackEvent = useCallback((name: string, properties?: Record<string, any>) => {
    analytics.track(name, properties);
  }, []);
  
  const trackPageView = useCallback((page: string) => {
    analytics.trackPageView(page);
  }, []);
  
  const trackAction = useCallback((action: string, details?: Record<string, any>) => {
    analytics.trackAction(action, details);
  }, []);
  
  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    analytics.trackError(error, context);
  }, []);
  
  return {
    trackEvent,
    trackPageView,
    trackAction,
    trackError
  };
};
