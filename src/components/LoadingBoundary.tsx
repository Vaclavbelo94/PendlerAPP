import React, { ReactNode, Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Loader2 } from 'lucide-react';

interface LoadingBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

// Skeleton screen component
const DefaultLoadingSkeleton = () => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-4 bg-muted rounded w-3/4"></div>
    <div className="h-4 bg-muted rounded w-1/2"></div>
    <div className="h-32 bg-muted rounded"></div>
  </div>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Combined loading and error boundary
export const LoadingBoundary: React.FC<LoadingBoundaryProps> = ({
  children,
  fallback = <LoadingSpinner />,
  errorFallback
}) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Specific loading components for different use cases
export const PageLoadingBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <LoadingBoundary fallback={<DefaultLoadingSkeleton />}>
    {children}
  </LoadingBoundary>
);

export const ComponentLoadingBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <LoadingBoundary fallback={<LoadingSpinner />}>
    {children}
  </LoadingBoundary>
);