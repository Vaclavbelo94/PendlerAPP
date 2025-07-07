
import { lazy } from 'react';

// Enhanced components with new features - Phase 1 Complete
export const EnhancedCommuteOptimizerLazy = lazy(() => import('./EnhancedCommuteOptimizer'));
export const EnhancedRideSharingLazy = lazy(() => import('./EnhancedRideSharing'));
export const EnhancedTrafficPredictionsLazy = lazy(() => import('./EnhancedTrafficPredictions'));
export const QuickRouteSelectorLazy = lazy(() => import('./QuickRouteSelector'));
export const TrafficMapLazy = lazy(() => import('./TrafficMap'));
export const TravelAnalyticsLazy = lazy(() => import('./TravelAnalyticsDashboard'));

// Phase 2 Components - Smart Traffic & Multi-modal
export const TrafficAlertsManagerLazy = lazy(() => import('./alerts/TrafficAlertsManager'));
export const MultiModalTransportSelectorLazy = lazy(() => import('./multimodal/MultiModalTransportSelector'));

// Phase 3 Components - AI Insights & Community
export const AITravelInsightsLazy = lazy(() => import('./insights/AITravelInsights'));
export const TravelCommunityHubLazy = lazy(() => import('./community/TravelCommunityHub'));
export const SmartTravelRecommendationsLazy = lazy(() => import('./smart/SmartTravelRecommendations'));
export const TravelAnalyticsDashboardLazy = lazy(() => import('./analytics/TravelAnalyticsDashboard'));

// Keep existing components for backward compatibility
export const CommuteOptimizerLazy = lazy(() => import('./CommuteOptimizer'));
export const RideSharingLazy = lazy(() => import('./RideSharing'));
export const CommuteCostCalculatorLazy = lazy(() => import('./CommuteCostCalculator'));
export const TrafficPredictionsLazy = lazy(() => import('./TrafficPredictions'));

// Optimized components
export const OptimizedAddressAutocompleteLazy = lazy(() => import('./OptimizedAddressAutocomplete'));
