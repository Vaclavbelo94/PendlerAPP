
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdProvider } from "@/components/ads/AdProvider";
import { AdBanner } from "@/components/ads/AdBanner";

// Lazy load new modern components
const ModernHero = React.lazy(() => import("@/components/home/ModernHero"));
const ModernFeatures = React.lazy(() => import("@/components/home/ModernFeatures"));
const ModernTestimonials = React.lazy(() => import("@/components/home/ModernTestimonials"));
const ModernCTA = React.lazy(() => import("@/components/home/ModernCTA"));

// Enhanced loading placeholder
const ModernSectionLoader = () => (
  <div className="w-full py-20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Skeleton className="h-12 w-2/3 mx-auto mb-4" />
        <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface ModernIndexContentProps {
  animatedHeroVisible: boolean;
}

export const ModernIndexContent = ({ animatedHeroVisible }: ModernIndexContentProps) => {
  return (
    <AdProvider>
      <Suspense fallback={<ModernSectionLoader />}>
        {animatedHeroVisible && <ModernHero />}
      </Suspense>
      
      <Suspense fallback={<ModernSectionLoader />}>
        <ModernFeatures />
      </Suspense>

      {/* Ad banner between sections */}
      <div className="py-8 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <AdBanner 
            className="max-w-4xl mx-auto"
            variant="horizontal"
          />
        </div>
      </div>
      
      <Suspense fallback={<ModernSectionLoader />}>
        <ModernTestimonials />
      </Suspense>
      
      <Suspense fallback={<ModernSectionLoader />}>
        <ModernCTA />
      </Suspense>
    </AdProvider>
  );
};
