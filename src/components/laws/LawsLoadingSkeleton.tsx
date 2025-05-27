
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const LawsLoadingSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      
      {/* Navigation skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-5 w-20 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-6 w-48 mt-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LawsLoadingSkeleton;
