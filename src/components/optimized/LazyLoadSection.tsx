
import React, { useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyLoadSectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

const DefaultSkeleton = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
    </div>
  </div>
);

export const LazyLoadSection: React.FC<LazyLoadSectionProps> = ({
  children,
  fallback = <DefaultSkeleton />,
  threshold = 0.1,
  rootMargin = '100px',
  className = ''
}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsInView(true);
          // Small delay to prevent layout shifts
          setTimeout(() => setHasLoaded(true), 50);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentSection);

    return () => observer.disconnect();
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div ref={sectionRef} className={className}>
      {hasLoaded ? children : fallback}
    </div>
  );
};
