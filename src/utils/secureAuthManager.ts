import { supabase } from '@/integrations/supabase/client';
import { securityValidator } from './securityValidator';

interface AuthAttempt {
  email: string;
  timestamp: number;
  success: boolean;
  ip?: string;
}

/**
 * Enhanced authentication manager with security monitoring
 */
export class SecureAuthManager {
  private static instance: SecureAuthManager;
  private authAttempts: Map<string, AuthAttempt[]> = new Map();
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  static getInstance(): SecureAuthManager {
    if (!SecureAuthManager.instance) {
      SecureAuthManager.instance = new SecureAuthManager();
    }
    return SecureAuthManager.instance;
  }

  /**
   * Secure sign in with monitoring
   */
  async signIn(email: string, password: string): Promise<{ error: any, user?: any }> {
    // Validate inputs
    const emailValidation = securityValidator.validateAndSanitizeInput(email, 'email');
    if (!emailValidation.isValid) {
      return { error: { message: 'Invalid email format' } };
    }

    // Check for account lockout
    if (this.isAccountLocked(email)) {
      this.logSecurityEvent('BLOCKED_LOGIN_ATTEMPT', { email, reason: 'account_locked' });
      return { error: { message: 'Account temporarily locked due to multiple failed attempts' } };
    }

    // Rate limiting
    if (!securityValidator.checkRateLimit(email)) {
      this.logSecurityEvent('RATE_LIMITED', { email });
      return { error: { message: 'Too many requests. Please try again later.' } };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailValidation.sanitized,
        password
      });

      if (error) {
        this.recordFailedAttempt(email);
        this.logSecurityEvent('FAILED_LOGIN', { email, error: error.message });
        return { error };
      }

      // Success - clear failed attempts
      this.clearFailedAttempts(email);
      this.logSecurityEvent('SUCCESSFUL_LOGIN', { email, userId: data.user?.id });

      return { error: null, user: data.user };
    } catch (error) {
      this.recordFailedAttempt(email);
      this.logSecurityEvent('LOGIN_ERROR', { email, error });
      return { error };
    }
  }

  /**
   * Secure sign out with cleanup
   */
  async signOut(): Promise<void> {
    try {
      // Get current user for logging
      const { data: { user } } = await supabase.auth.getUser();
      
      // Perform global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear sensitive data
      this.clearAuthState();
      
      // Log security event
      this.logSecurityEvent('LOGOUT', { userId: user?.id });
      
    } catch (error) {
      console.error('Secure logout error:', error);
      // Force cleanup even on error
      this.clearAuthState();
    }
  }

  /**
   * Check if account is locked due to failed attempts
   */
  private isAccountLocked(email: string): boolean {
    const attempts = this.authAttempts.get(email) || [];
    const recentFailedAttempts = attempts.filter(
      attempt => !attempt.success && 
      Date.now() - attempt.timestamp < this.LOCKOUT_DURATION
    );

    return recentFailedAttempts.length >= this.MAX_FAILED_ATTEMPTS;
  }

  /**
   * Record failed authentication attempt
   */
  private recordFailedAttempt(email: string): void {
    const attempts = this.authAttempts.get(email) || [];
    attempts.push({
      email,
      timestamp: Date.now(),
      success: false
    });

    // Keep only recent attempts
    const recentAttempts = attempts.filter(
      attempt => Date.now() - attempt.timestamp < this.LOCKOUT_DURATION
    );

    this.authAttempts.set(email, recentAttempts);
  }

  /**
   * Clear failed attempts on successful login
   */
  private clearFailedAttempts(email: string): void {
    this.authAttempts.delete(email);
  }

  /**
   * Clean up authentication state
   */
  private clearAuthState(): void {
    // Clear sensitive localStorage keys
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith('supabase.auth.') || 
      key.includes('sb-') ||
      key === 'user-data' ||
      key === 'adminLoggedIn'
    );

    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Failed to remove localStorage key:', key);
      }
    });

    // Clear sessionStorage
    try {
      Object.keys(sessionStorage || {}).forEach(key => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear sessionStorage');
    }
  }

  /**
   * Log security events
   */
  private logSecurityEvent(event: string, details: any): void {
    const securityLog = {
      event,
      details,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Store in localStorage for admin review
    const securityLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
    securityLogs.unshift(securityLog);
    
    if (securityLogs.length > 100) {
      securityLogs.splice(100);
    }
    
    localStorage.setItem('securityLogs', JSON.stringify(securityLogs));

    console.log('🔒 Security Event:', securityLog);
  }

  /**
   * Get security statistics for admin panel
   */
  getSecurityStats(): any {
    const securityLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
    const last24h = Date.now() - (24 * 60 * 60 * 1000);
    
    const recentLogs = securityLogs.filter((log: any) => log.timestamp > last24h);
    
    return {
      totalEvents: securityLogs.length,
      last24h: recentLogs.length,
      failedLogins: recentLogs.filter((log: any) => log.event === 'FAILED_LOGIN').length,
      blockedAttempts: recentLogs.filter((log: any) => log.event === 'BLOCKED_LOGIN_ATTEMPT').length,
      rateLimited: recentLogs.filter((log: any) => log.event === 'RATE_LIMITED').length
    };
  }
}

export const secureAuthManager = SecureAuthManager.getInstance();
