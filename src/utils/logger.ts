// Centralized logging utility with conditional production logging
// Replaces direct console.log usage throughout the application

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  userId?: string;
  action?: string;
  timestamp?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logQueue: Array<{ level: LogLevel; message: string; context?: LogContext; timestamp: string }> = [];
  private maxQueueSize = 100;

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (context) {
      const contextStr = Object.entries(context)
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join(' ');
      return `${prefix} ${message} | ${contextStr}`;
    }
    
    return `${prefix} ${message}`;
  }

  private addToQueue(level: LogLevel, message: string, context?: LogContext) {
    const logEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString()
    };

    this.logQueue.push(logEntry);
    
    // Keep queue size manageable
    if (this.logQueue.length > this.maxQueueSize) {
      this.logQueue.shift();
    }

    // In production, only store critical logs
    if (!this.isDevelopment && level !== 'error' && level !== 'warn') {
      return;
    }
  }

  debug(message: string, context?: LogContext) {
    this.addToQueue('debug', message, context);
    
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext) {
    this.addToQueue('info', message, context);
    
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext) {
    this.addToQueue('warn', message, context);
    
    // Always show warnings, even in production
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, context?: LogContext) {
    this.addToQueue('error', message, context);
    
    // Always show errors, even in production
    console.error(this.formatMessage('error', message, context));
  }

  // Get recent logs for debugging
  getRecentLogs(level?: LogLevel): typeof this.logQueue {
    if (level) {
      return this.logQueue.filter(log => log.level === level);
    }
    return [...this.logQueue];
  }

  // Clear the log queue
  clearLogs() {
    this.logQueue = [];
  }

  // Export logs for debugging
  exportLogs(): string {
    return this.logQueue
      .map(log => this.formatMessage(log.level, log.message, log.context))
      .join('\n');
  }
}

// Create singleton instance
export const logger = new Logger();

// Convenience functions for backward compatibility
export const logDebug = (message: string, context?: LogContext) => logger.debug(message, context);
export const logInfo = (message: string, context?: LogContext) => logger.info(message, context);
export const logWarn = (message: string, context?: LogContext) => logger.warn(message, context);
export const logError = (message: string, context?: LogContext) => logger.error(message, context);
