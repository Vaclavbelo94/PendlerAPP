
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'closed' | 'open' | 'half-open';
}

class OptimizedErrorHandler {
  private static instance: OptimizedErrorHandler;
  private retryAttempts = new Map<string, number>();
  private circuitBreakers = new Map<string, CircuitBreakerState>();
  private requestCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  static getInstance(): OptimizedErrorHandler {
    if (!OptimizedErrorHandler.instance) {
      OptimizedErrorHandler.instance = new OptimizedErrorHandler();
    }
    return OptimizedErrorHandler.instance;
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationKey: string,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const defaultConfig: RetryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffFactor: 2
    };

    const finalConfig = { ...defaultConfig, ...config };

    // Check circuit breaker
    if (this.isCircuitOpen(operationKey)) {
      throw new Error(`Circuit breaker open for ${operationKey}`);
    }

    // Check cache first
    const cached = this.getFromCache(operationKey);
    if (cached) {
      return cached;
    }

    let lastError: any;
    const attempts = this.retryAttempts.get(operationKey) || 0;

    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        const result = await operation();
        
        // Reset on success
        this.retryAttempts.delete(operationKey);
        this.resetCircuitBreaker(operationKey);
        
        // Cache successful result
        this.setCache(operationKey, result, 5 * 60 * 1000); // 5 minutes TTL
        
        return result;
      } catch (error) {
        lastError = error;
        this.recordFailure(operationKey);

        if (attempt === finalConfig.maxRetries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          finalConfig.baseDelay * Math.pow(finalConfig.backoffFactor, attempt),
          finalConfig.maxDelay
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    this.retryAttempts.set(operationKey, attempts + 1);
    throw lastError;
  }

  private isCircuitOpen(key: string): boolean {
    const breaker = this.circuitBreakers.get(key);
    if (!breaker || breaker.state === 'closed') return false;

    const now = Date.now();
    const timeSinceLastFailure = now - breaker.lastFailureTime;

    if (breaker.state === 'open' && timeSinceLastFailure > 30000) { // 30 seconds
      breaker.state = 'half-open';
      return false;
    }

    return breaker.state === 'open';
  }

  private recordFailure(key: string): void {
    const breaker = this.circuitBreakers.get(key) || {
      failures: 0,
      lastFailureTime: 0,
      state: 'closed' as const
    };

    breaker.failures++;
    breaker.lastFailureTime = Date.now();

    if (breaker.failures >= 5) {
      breaker.state = 'open';
    }

    this.circuitBreakers.set(key, breaker);
  }

  private resetCircuitBreaker(key: string): void {
    this.circuitBreakers.set(key, {
      failures: 0,
      lastFailureTime: 0,
      state: 'closed'
    });
  }

  private getFromCache(key: string): any {
    const cached = this.requestCache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.requestCache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.requestCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  clearCache(): void {
    this.requestCache.clear();
  }
}

export const optimizedErrorHandler = OptimizedErrorHandler.getInstance();
