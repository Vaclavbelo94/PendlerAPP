
export interface AppError {
  message: string;
  code?: string;
  context?: any;
}

export const errorHandler = {
  handleError: (error: any, context?: { 
    operation?: string; 
    userId?: string; 
    shiftId?: string; 
    conflictId?: string;
    shiftData?: any;
    action?: string;
    item?: any;
    date?: string;
    data?: any;
    maxRetriesReached?: boolean;
  }) => {
    console.error('Error occurred:', {
      error,
      context,
      timestamp: new Date().toISOString()
    });
    
    // In production, you might want to send this to a logging service
    // For now, just log to console
  },

  retryOperation: async (operation: () => Promise<any>, maxRetries: number = 3): Promise<any> => {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }
    
    throw lastError;
  }
};
