
import { lazy } from 'react';
import { LazyLoadSection } from '@/components/optimized/LazyLoadSection';

// Lazy load travel components
export const LazyCommuteOptimizer = lazy(() => import('./CommuteOptimizer'));
export const LazyRideSharing = lazy(() => import('./RideSharing'));
export const LazyCommuteCostCalculator = lazy(() => import('./CommuteCostCalculator'));
export const LazyTrafficPredictions = lazy(() => import('./TrafficPredictions'));

// Wrapper components with loading states
export const CommuteOptimizerLazy = () => (
  <LazyLoadSection>
    <LazyCommuteOptimizer />
  </LazyLoadSection>
);

export const RideSharingLazy = () => (
  <LazyLoadSection>
    <LazyRideSharing />
  </LazyLoadSection>
);

export const CommuteCostCalculatorLazy = () => (
  <LazyLoadSection>
    <LazyCommuteCostCalculator />
  </LazyLoadSection>
);

export const TrafficPredictionsLazy = () => (
  <LazyLoadSection>
    <LazyTrafficPredictions />
  </LazyLoadSection>
);
