
import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy loaded komponenty pro optimalizaci bundle size
const ShiftAnalytics = React.lazy(() => import('../ShiftAnalytics'));
const ReportsTab = React.lazy(() => import('../ReportsTab'));
const EditNoteDialog = React.lazy(() => import('../EditNoteDialog'));

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

// Wrapped komponenty s lazy loading
export const LazyShiftAnalytics: React.FC<any> = (props) => (
  <Suspense fallback={<AnalyticsLoader />}>
    <ShiftAnalytics {...props} />
  </Suspense>
);

export const LazyReportsTab: React.FC<any> = (props) => (
  <Suspense fallback={<ReportsLoader />}>
    <ReportsTab {...props} />
  </Suspense>
);

export const LazyEditNoteDialog: React.FC<any> = (props) => (
  <Suspense fallback={<DialogLoader />}>
    <EditNoteDialog {...props} />
  </Suspense>
);
