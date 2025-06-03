import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { safeLocalStorageSet, checkLocalStorageSpace } from '@/utils/authUtils';

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

    // Check storage space before attempting to store
    if (checkLocalStorageSpace() < 2048) {
      console.warn('Low localStorage space, skipping session storage');
      return;
    }

    // Store session in localStorage with safe storage
    try {
      const existingSesSions = JSON.parse(localStorage.getItem('userSessions') || '[]');
      existingSesSions.push(sessionRef.current);
      
      // Keep only last 5 sessions (reduced from 10)
      if (existingSesSions.length > 5) {
        existingSesSions.splice(0, existingSesSions.length - 5);
      }
      
      const success = safeLocalStorageSet('userSessions', JSON.stringify(existingSesSions));
      if (!success) {
        console.warn('Failed to store user session, localStorage may be full');
      }
    } catch (error) {
      console.warn('Error storing user session:', error);
    }
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

    // Check storage space before attempting to store
    if (checkLocalStorageSpace() < 1024) {
      console.warn('Low localStorage space, skipping event storage');
      return;
    }

    // Store events locally with safe storage
    try {
      const existingEvents = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
      existingEvents.push(analyticsEvent);
      
      // Keep only last 500 events (reduced from 1000)
      if (existingEvents.length > 500) {
        existingEvents.splice(0, existingEvents.length - 500);
      }
      
      const success = safeLocalStorageSet('analyticsEvents', JSON.stringify(existingEvents));
      if (!success) {
        console.warn('Failed to store analytics event, localStorage may be full');
      }
    } catch (error) {
      console.warn('Error storing analytics event:', error);
    }

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
      
      // Check storage space before attempting to update
      if (checkLocalStorageSpace() < 1024) {
        console.warn('Low localStorage space, skipping session update');
        return;
      }
      
      // Update stored session with safe storage
      try {
        const existingSessions = JSON.parse(localStorage.getItem('userSessions') || '[]');
        const sessionIndex = existingSessions.findIndex(
          (s: UserSession) => s.sessionId === sessionRef.current!.sessionId
        );
        
        if (sessionIndex !== -1) {
          existingSessions[sessionIndex] = sessionRef.current;
          const success = safeLocalStorageSet('userSessions', JSON.stringify(existingSessions));
          if (!success) {
            console.warn('Failed to update session, localStorage may be full');
          }
        }
      } catch (error) {
        console.warn('Error updating session:', error);
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
