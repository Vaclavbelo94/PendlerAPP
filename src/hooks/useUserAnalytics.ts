import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

interface UserSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  pageViews: number;
  events: AnalyticsEvent[];
  userAgent: string;
  referrer: string;
}

export const useUserAnalytics = () => {
  const { user } = useAuth();
  const sessionRef = useRef<UserSession | null>(null);

  const getSessionId = useCallback(() => {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }, []);

  const initializeSession = useCallback(() => {
    if (sessionRef.current) return;

    const sessionId = getSessionId();
    sessionRef.current = {
      sessionId,
      startTime: Date.now(),
      pageViews: 0,
      events: [],
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    // Store session in localStorage
    const existingSessions = JSON.parse(localStorage.getItem('userSessions') || '[]');
    existingSessions.push(sessionRef.current);
    
    // Keep only last 10 sessions
    if (existingSessions.length > 10) {
      existingSessions.splice(0, existingSessions.length - 10);
    }
    
    localStorage.setItem('userSessions', JSON.stringify(existingSessions));
  }, [getSessionId]);

  const trackEvent = useCallback((event: string, properties: Record<string, any> = {}) => {
    if (!sessionRef.current) {
      initializeSession();
    }

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        page: window.location.pathname,
        referrer: document.referrer
      },
      timestamp: Date.now(),
      userId: user?.id,
      sessionId: sessionRef.current!.sessionId
    };

    sessionRef.current!.events.push(analyticsEvent);

    // Store events locally
    const existingEvents = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
    existingEvents.push(analyticsEvent);
    
    // Keep only last 1000 events
    if (existingEvents.length > 1000) {
      existingEvents.splice(0, existingEvents.length - 1000);
    }
    
    localStorage.setItem('analyticsEvents', JSON.stringify(existingEvents));

    console.log('Analytics Event:', analyticsEvent);
  }, [user?.id, initializeSession]);

  const trackPageView = useCallback((path?: string) => {
    const currentPath = path || window.location.pathname;
    
    if (sessionRef.current) {
      sessionRef.current.pageViews++;
    }

    trackEvent('page_view', {
      path: currentPath,
      search: window.location.search,
      hash: window.location.hash,
      title: document.title
    });
  }, [trackEvent]);

  const endSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.endTime = Date.now();
      
      // Update stored session
      const existingSessions = JSON.parse(localStorage.getItem('userSessions') || '[]');
      const sessionIndex = existingSessions.findIndex(
        (s: UserSession) => s.sessionId === sessionRef.current!.sessionId
      );
      
      if (sessionIndex !== -1) {
        existingSessions[sessionIndex] = sessionRef.current;
        localStorage.setItem('userSessions', JSON.stringify(existingSessions));
      }
    }
  }, []);

  useEffect(() => {
    initializeSession();
    trackPageView();

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        endSession();
      } else {
        initializeSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Track beforeunload
    const handleBeforeUnload = () => {
      endSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      endSession();
    };
  }, [initializeSession, trackPageView, endSession]);

  return {
    trackEvent,
    trackPageView,
    endSession,
    sessionId: sessionRef.current?.sessionId
  };
};
