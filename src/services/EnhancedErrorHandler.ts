
import { unifiedToastService } from './UnifiedToastService';

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  retry?: boolean;
  context?: Record<string, any>;
}

class EnhancedErrorHandler {
  private static instance: EnhancedErrorHandler;
  private retryAttempts = new Map<string, number>();

  static getInstance(): EnhancedErrorHandler {
    if (!EnhancedErrorHandler.instance) {
      EnhancedErrorHandler.instance = new EnhancedErrorHandler();
    }
    return EnhancedErrorHandler.instance;
  }

  handleShiftError(error: any, operation: 'save' | 'delete' | 'load'): AppError {
    const appError = this.parseError(error, { operation });
    this.logError(appError);
    
    // Use unified toast service for user feedback
    unifiedToastService.showShiftError(operation, appError.message);
    
    return appError;
  }

  handleDHLError(error: any, context?: Record<string, any>): AppError {
    const appError = this.parseError(error, context);
    this.logError(appError);
    
    unifiedToastService.showDHLSetupError(appError.message);
    
    return appError;
  }

  handleGenericError(error: any, context?: Record<string, any>): AppError {
    const appError = this.parseError(error, context);
    this.logError(appError);
    
    unifiedToastService.showGenericError(appError.message);
    
    return appError;
  }

  private parseError(error: any, context?: Record<string, any>): AppError {
    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        message: 'Problém s připojením k internetu',
        code: 'NETWORK_ERROR',
        retry: true,
        context
      };
    }

    // Supabase errors
    if (error.code) {
      switch (error.code) {
        case 'PGRST116':
          return {
            message: 'Data nebyla nalezena',
            code: 'NOT_FOUND',
            retry: false,
            context
          };
        case '23505':
          return {
            message: 'Tato položka již existuje',
            code: 'DUPLICATE_ENTRY',
            retry: false,
            context
          };
        case '42501':
          return {
            message: 'Nemáte oprávnění k této akci',
            code: 'INSUFFICIENT_PRIVILEGE',
            retry: false,
            context
          };
        default:
          return {
            message: 'Chyba databáze',
            code: error.code,
            retry: true,
            context
          };
      }
    }

    // HTTP errors
    if (error.status) {
      switch (error.status) {
        case 401:
          return {
            message: 'Nejste přihlášeni',
            code: 'UNAUTHORIZED',
            statusCode: 401,
            retry: false,
            context
          };
        case 403:
          return {
            message: 'Nemáte oprávnění',
            code: 'FORBIDDEN',
            statusCode: 403,
            retry: false,
            context
          };
        case 429:
          return {
            message: 'Příliš mnoho požadavků, zkuste později',
            code: 'RATE_LIMIT',
            statusCode: 429,
            retry: true,
            context
          };
        case 500:
          return {
            message: 'Chyba serveru',
            code: 'SERVER_ERROR',
            statusCode: 500,
            retry: true,
            context
          };
        default:
          return {
            message: `HTTP chyba: ${error.status}`,
            code: 'HTTP_ERROR',
            statusCode: error.status,
            retry: true,
            context
          };
      }
    }

    // Generic error
    return {
      message: error.message || 'Neočekávaná chyba',
      code: 'UNKNOWN_ERROR',
      retry: true,
      context
    };
  }

  private logError(error: AppError): void {
    const errorKey = `${error.code}_${error.message}`;
    const attempts = this.retryAttempts.get(errorKey) || 0;
    
    console.error('Application Error:', {
      ...error,
      attempts,
      timestamp: new Date().toISOString()
    });

    this.retryAttempts.set(errorKey, attempts + 1);
  }

  async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw this.handleGenericError(lastError, { maxRetries, finalAttempt: true });
  }

  clearRetryHistory(): void {
    this.retryAttempts.clear();
  }
}

export const enhancedErrorHandler = EnhancedErrorHandler.getInstance();
