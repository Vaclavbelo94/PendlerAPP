
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
}

export interface ErrorContext {
  operation: string;
  entityType?: string;
  entityId?: string;
  timestamp: Date;
  retryCount: number;
  userAgent?: string;
  networkStatus?: 'online' | 'offline';
}

export interface CategorizedError {
  id: string;
  type: 'network' | 'validation' | 'server' | 'timeout' | 'quota' | 'permission' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  originalError: any;
  context: ErrorContext;
  retryable: boolean;
  userMessage: string;
}

export class AdvancedErrorHandlingService {
  private static instance: AdvancedErrorHandlingService;
  private errorHistory: Map<string, CategorizedError[]> = new Map();
  private retryQueues: Map<string, Function[]> = new Map();

  static getInstance(): AdvancedErrorHandlingService {
    if (!AdvancedErrorHandlingService.instance) {
      AdvancedErrorHandlingService.instance = new AdvancedErrorHandlingService();
    }
    return AdvancedErrorHandlingService.instance;
  }

  // Default retry configurations for different operations
  private defaultConfigs: Record<string, RetryConfig> = {
    'network': {
      maxRetries: 5,
      baseDelay: 1000,
      maxDelay: 30000,
      backoffMultiplier: 2,
      jitter: true
    },
    'database': {
      maxRetries: 3,
      baseDelay: 500,
      maxDelay: 5000,
      backoffMultiplier: 1.5,
      jitter: true
    },
    'sync': {
      maxRetries: 7,
      baseDelay: 2000,
      maxDelay: 60000,
      backoffMultiplier: 2.5,
      jitter: true
    },
    'upload': {
      maxRetries: 4,
      baseDelay: 1500,
      maxDelay: 15000,
      backoffMultiplier: 2,
      jitter: false
    }
  };

  // Categorize and handle errors
  categorizeError(error: any, context: ErrorContext): CategorizedError {
    const errorId = `${context.operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    let type: CategorizedError['type'] = 'unknown';
    let severity: CategorizedError['severity'] = 'medium';
    let retryable = true;
    let userMessage = 'Došlo k neočekávané chybě. Zkusíme to znovu.';

    // Network errors
    if (this.isNetworkError(error)) {
      type = 'network';
      severity = 'medium';
      retryable = true;
      userMessage = 'Problém s připojením k internetu. Zkusíme to automaticky znovu.';
    }
    // Validation errors
    else if (this.isValidationError(error)) {
      type = 'validation';
      severity = 'low';
      retryable = false;
      userMessage = 'Neplatná data. Zkontrolujte prosím zadané informace.';
    }
    // Server errors
    else if (this.isServerError(error)) {
      type = 'server';
      severity = error.status >= 500 ? 'high' : 'medium';
      retryable = error.status >= 500;
      userMessage = retryable ? 
        'Dočasný problém se serverem. Zkusíme to znovu.' :
        'Problém se serverem. Zkuste to prosím později.';
    }
    // Timeout errors
    else if (this.isTimeoutError(error)) {
      type = 'timeout';
      severity = 'medium';
      retryable = true;
      userMessage = 'Operace trvala příliš dlouho. Zkusíme to znovu s kratším časovým limitem.';
    }
    // Quota/Rate limit errors
    else if (this.isQuotaError(error)) {
      type = 'quota';
      severity = 'medium';
      retryable = true;
      userMessage = 'Překročen limit požadavků. Počkáme chvíli a zkusíme to znovu.';
    }
    // Permission errors
    else if (this.isPermissionError(error)) {
      type = 'permission';
      severity = 'high';
      retryable = false;
      userMessage = 'Nemáte oprávnění k této operaci. Přihlaste se prosím znovu.';
    }

    const categorizedError: CategorizedError = {
      id: errorId,
      type,
      severity,
      message: error.message || 'Neznámá chyba',
      originalError: error,
      context,
      retryable,
      userMessage
    };

    // Store in history
    const operationHistory = this.errorHistory.get(context.operation) || [];
    operationHistory.push(categorizedError);
    this.errorHistory.set(context.operation, operationHistory.slice(-10)); // Keep last 10

    return categorizedError;
  }

  // Exponential backoff with jitter
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    config?: Partial<RetryConfig>
  ): Promise<T> {
    const finalConfig = { 
      ...this.defaultConfigs[context.operation] || this.defaultConfigs['network'], 
      ...config 
    };

    let lastError: any;
    
    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        context.retryCount = attempt;
        return await operation();
      } catch (error) {
        lastError = error;
        const categorizedError = this.categorizeError(error, context);
        
        // Don't retry if not retryable or max retries reached
        if (!categorizedError.retryable || attempt === finalConfig.maxRetries) {
          throw categorizedError;
        }

        // Calculate delay with exponential backoff
        const delay = this.calculateDelay(attempt, finalConfig);
        console.log(`Attempt ${attempt + 1} failed for ${context.operation}. Retrying in ${delay}ms...`);
        
        await this.delay(delay);
      }
    }

    throw this.categorizeError(lastError, context);
  }

  // Smart delay calculation with jitter
  private calculateDelay(attempt: number, config: RetryConfig): number {
    let delay = Math.min(
      config.baseDelay * Math.pow(config.backoffMultiplier, attempt),
      config.maxDelay
    );

    // Add jitter to prevent thundering herd
    if (config.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    return Math.floor(delay);
  }

  // Utility methods for error detection
  private isNetworkError(error: any): boolean {
    return (
      error.name === 'TypeError' && error.message.includes('fetch') ||
      error.code === 'NETWORK_ERROR' ||
      error.message?.toLowerCase().includes('network') ||
      error.message?.toLowerCase().includes('connection')
    );
  }

  private isValidationError(error: any): boolean {
    return (
      error.status >= 400 && error.status < 500 ||
      error.code?.startsWith('VALIDATION_') ||
      error.message?.toLowerCase().includes('validation')
    );
  }

  private isServerError(error: any): boolean {
    return error.status >= 500 && error.status < 600;
  }

  private isTimeoutError(error: any): boolean {
    return (
      error.name === 'TimeoutError' ||
      error.code === 'TIMEOUT' ||
      error.message?.toLowerCase().includes('timeout')
    );
  }

  private isQuotaError(error: any): boolean {
    return (
      error.status === 429 ||
      error.code === 'QUOTA_EXCEEDED' ||
      error.message?.toLowerCase().includes('rate limit')
    );
  }

  private isPermissionError(error: any): boolean {
    return (
      error.status === 401 || error.status === 403 ||
      error.code?.includes('PERMISSION') ||
      error.message?.toLowerCase().includes('unauthorized')
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Queue management for failed operations
  queueFailedOperation(operationType: string, operation: Function): void {
    if (!this.retryQueues.has(operationType)) {
      this.retryQueues.set(operationType, []);
    }
    this.retryQueues.get(operationType)!.push(operation);
  }

  async processRetryQueue(operationType: string): Promise<void> {
    const queue = this.retryQueues.get(operationType);
    if (!queue || queue.length === 0) return;

    const operations = [...queue];
    this.retryQueues.set(operationType, []);

    for (const operation of operations) {
      try {
        await operation();
      } catch (error) {
        // If still failing, put back in queue with lower priority
        this.queueFailedOperation(operationType, operation);
      }
    }
  }

  // Get error statistics
  getErrorStatistics(operationType?: string): any {
    const allErrors = operationType 
      ? this.errorHistory.get(operationType) || []
      : Array.from(this.errorHistory.values()).flat();

    const stats = {
      total: allErrors.length,
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      retryable: 0,
      recent: allErrors.filter(e => 
        Date.now() - e.context.timestamp.getTime() < 3600000 // Last hour
      ).length
    };

    allErrors.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
      if (error.retryable) stats.retryable++;
    });

    return stats;
  }

  // Clear old error history
  clearOldErrors(olderThanHours: number = 24): void {
    const cutoff = Date.now() - (olderThanHours * 60 * 60 * 1000);
    
    this.errorHistory.forEach((errors, operation) => {
      const filteredErrors = errors.filter(error => 
        error.context.timestamp.getTime() > cutoff
      );
      this.errorHistory.set(operation, filteredErrors);
    });
  }
}

export const advancedErrorHandler = AdvancedErrorHandlingService.getInstance();
