
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load components to improve initial loading performance
const Hero = React.lazy(() => import("@/components/home/Hero"));
const Features = React.lazy(() => import("@/components/home/Features"));
const Benefits = React.lazy(() => import("@/components/home/Benefits"));
const AppShowcase = React.lazy(() => import("@/components/home/AppShowcase"));
const CTA = React.lazy(() => import("@/components/home/CTA"));

// Optimalizovaný loading placeholder
const SectionLoader = () => (
  <div className="w-full py-16">
    <div className="container mx-auto px-4">
      <Skeleton className="h-8 w-1/3 mx-auto mb-4" />
      <Skeleton className="h-4 w-2/3 mx-auto mb-2" />
      <Skeleton className="h-4 w-1/2 mx-auto mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-64 rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-10 w-1/3" />
        </div>
      </div>
    </div>
  </div>
);

interface IndexContentProps {
  animatedHeroVisible: boolean;
}

export const IndexContent = ({ animatedHeroVisible }: IndexContentProps) => {
  return (
    <>
      <Suspense fallback={<SectionLoader />}>
        {animatedHeroVisible && <Hero />}
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <Features />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <Benefits />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <AppShowcase />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <CTA />
      </Suspense>
    </>
  );
};
