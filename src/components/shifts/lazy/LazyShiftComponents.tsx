
import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

// Error fallback pro lazy loaded komponenty
const LazyErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <AlertTriangle className="h-8 w-8 text-destructive" />
    <p className="text-sm text-muted-foreground text-center">
      Nepodařilo se načíst komponentu: {error.message}
    </p>
    <Button onClick={retry} variant="outline" size="sm">
      Zkusit znovu
    </Button>
  </div>
);

// Safe lazy loader s error boundary
const createSafeLazyComponent = (importFn: () => Promise<any>, fallback: React.ComponentType) => {
  const LazyComponent = React.lazy(importFn);
  
  return React.forwardRef<any, any>((props, ref) => {
    const [error, setError] = React.useState<Error | null>(null);
    const [retryKey, setRetryKey] = React.useState(0);

    const retry = () => {
      setError(null);
      setRetryKey(prev => prev + 1);
    };

    if (error) {
      return <LazyErrorFallback error={error} retry={retry} />;
    }

    const FallbackComponent = fallback;

    return (
      <ErrorBoundary
        key={retryKey}
        fallback={<LazyErrorFallback error={error!} retry={retry} />}
        onError={setError}
      >
        <Suspense fallback={<FallbackComponent />}>
          <LazyComponent {...props} ref={ref} />
        </Suspense>
      </ErrorBoundary>
    );
  });
};

// Loading komponenty
const AnalyticsLoader = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  </div>
);

const ReportsLoader = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-64 w-full" />
    <Skeleton className="h-40 w-full" />
  </div>
);

const DialogLoader = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-6 w-32" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-10 w-20" />
  </div>
);

// Bezpečné lazy loaded komponenty
export const LazyShiftAnalytics = createSafeLazyComponent(
  () => import('../ShiftAnalytics').catch(err => {
    console.error('Failed to load ShiftAnalytics:', err);
    throw new Error('Nepodařilo se načíst analytiku směn');
  }),
  AnalyticsLoader
);

export const LazyReportsTab = createSafeLazyComponent(
  () => import('../ReportsTab').then(module => ({ default: module.ReportsTab })).catch(err => {
    console.error('Failed to load ReportsTab:', err);
    throw new Error('Nepodařilo se načíst reporty');
  }),
  ReportsLoader
);

export const LazyEditNoteDialog = createSafeLazyComponent(
  () => import('../EditNoteDialog').then(module => ({ default: module.EditNoteDialog })).catch(err => {
    console.error('Failed to load EditNoteDialog:', err);
    throw new Error('Nepodařilo se načíst editor poznámek');
  }),
  DialogLoader
);
