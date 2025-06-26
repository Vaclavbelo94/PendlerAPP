
export interface AppError {
  message: string;
  code?: string;
  context?: any;
}

export const errorHandler = {
  handleError: (error: any, context?: { operation?: string; userId?: string; shiftId?: string; conflictId?: string }) => {
    console.error('Error occurred:', {
      error,
      context,
      timestamp: new Date().toISOString()
    });
    
    // In production, you might want to send this to a logging service
    // For now, just log to console
  }
};
