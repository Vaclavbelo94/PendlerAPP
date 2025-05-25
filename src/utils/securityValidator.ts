
import { validateShiftNotes, sanitizeInput } from './inputValidation';

// Enhanced security validation
export class SecurityValidator {
  private static readonly MAX_REQUEST_SIZE = 1024 * 1024; // 1MB
  private static readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  private static readonly MAX_REQUESTS_PER_WINDOW = 100;
  
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();
  
  // Rate limiting
  checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requestCounts.get(identifier);
    
    if (!userRequests || now > userRequests.resetTime) {
      this.requestCounts.set(identifier, {
        count: 1,
        resetTime: now + SecurityValidator.RATE_LIMIT_WINDOW
      });
      return true;
    }
    
    if (userRequests.count >= SecurityValidator.MAX_REQUESTS_PER_WINDOW) {
      return false;
    }
    
    userRequests.count++;
    return true;
  }
  
  // Input validation and sanitization
  validateAndSanitizeInput(input: string, type: 'text' | 'email' | 'url' = 'text'): {
    isValid: boolean;
    sanitized: string;
    errors: string[];
  } {
    const errors: string[] = [];
    
    // Size check
    if (input.length > 1000) {
      errors.push('Input too long');
    }
    
    // Type-specific validation
    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input)) {
          errors.push('Invalid email format');
        }
        break;
      case 'url':
        try {
          new URL(input);
        } catch {
          errors.push('Invalid URL format');
        }
        break;
    }
    
    // Common security checks
    const maliciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi
    ];
    
    for (const pattern of maliciousPatterns) {
      if (pattern.test(input)) {
        errors.push('Potentially malicious content detected');
        break;
      }
    }
    
    return {
      isValid: errors.length === 0,
      sanitized: sanitizeInput(input),
      errors
    };
  }
  
  // CSRF token validation (placeholder)
  validateCSRFToken(token: string): boolean {
    // In a real implementation, this would validate against server-side token
    return token && token.length > 10;
  }
  
  // Content Security Policy headers (for reference)
  getCSPHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval'", // React needs unsafe-eval in dev
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "connect-src 'self' https://ghfjdgnnhhxhamcwjodx.supabase.co",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ')
    };
  }
}

export const securityValidator = new SecurityValidator();
