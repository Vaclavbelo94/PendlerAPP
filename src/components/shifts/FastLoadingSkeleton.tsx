
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface FastLoadingSkeletonProps {
  onRetry?: () => void;
  timeoutMs?: number;
}

const FastLoadingSkeleton: React.FC<FastLoadingSkeletonProps> = ({ 
  onRetry, 
  timeoutMs = 5000 
}) => {
  const [showRetry, setShowRetry] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShowRetry(true);
    }, timeoutMs);

    return () => clearTimeout(timeout);
  }, [timeoutMs]);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      
      {/* Navigation skeleton */}
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
      
      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Retry button after timeout */}
      {showRetry && onRetry && (
        <div className="flex justify-center mt-8">
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Zkusit znovu
          </Button>
        </div>
      )}
    </div>
  );
};

export default FastLoadingSkeleton;
