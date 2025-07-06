
import { lazy } from 'react';

// Enhanced components with new features - Phase 1 Complete
export const EnhancedCommuteOptimizerLazy = lazy(() => import('./EnhancedCommuteOptimizer'));
export const EnhancedRideSharingLazy = lazy(() => import('./EnhancedRideSharing'));
export const EnhancedTrafficPredictionsLazy = lazy(() => import('./EnhancedTrafficPredictions'));
export const QuickRouteSelectorLazy = lazy(() => import('./QuickRouteSelector'));
export const TrafficMapLazy = lazy(() => import('./TrafficMap'));
export const TravelAnalyticsLazy = lazy(() => import('./TravelAnalyticsDashboard'));

// Keep existing components for backward compatibility
export const CommuteOptimizerLazy = lazy(() => import('./CommuteOptimizer'));
export const RideSharingLazy = lazy(() => import('./RideSharing'));
export const CommuteCostCalculatorLazy = lazy(() => import('./CommuteCostCalculator'));
export const TrafficPredictionsLazy = lazy(() => import('./TrafficPredictions'));

// Optimized components
export const OptimizedAddressAutocompleteLazy = lazy(() => import('./OptimizedAddressAutocomplete'));
