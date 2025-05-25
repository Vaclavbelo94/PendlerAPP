
import { lazy } from 'react';

// Lazy load travel components for better performance
export const CommuteOptimizerLazy = lazy(() => import('./CommuteOptimizer'));
export const RideSharingLazy = lazy(() => import('./RideSharing'));
export const CommuteCostCalculatorLazy = lazy(() => import('./CommuteCostCalculator'));
export const TrafficPredictionsLazy = lazy(() => import('./TrafficPredictions'));
export const TravelAnalyticsLazy = lazy(() => import('./analytics/TravelAnalytics'));
