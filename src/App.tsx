
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { Toaster as ToasterTwo } from "@/components/ui/toaster";
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LazyLoadWrapper from '@/components/common/LazyLoadWrapper';
import PWAInstallPrompt from '@/components/common/PWAInstallPrompt';
import LayoutWrapper from '@/components/layouts/LayoutWrapper';
import ScrollToTop from '@/components/navigation/ScrollToTop';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { AuthProvider } from '@/hooks/auth';
import { ThemeProvider } from '@/hooks/useTheme';

// Lazy loaded components for better performance
import { 
  LazyShiftsModule,
  LazyVehicleModule, 
  LazyCalculatorModule,
  LazySettingsModule 
} from '@/utils/performanceOptimizer';

// Standard pages
import UnifiedHomePage from "@/pages/UnifiedHomePage";
import Dashboard from "@/pages/Dashboard";
import Vocabulary from "@/pages/Vocabulary";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import UnifiedProfile from "@/pages/UnifiedProfile";
import ProfileExtended from "@/pages/ProfileExtended";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Cookies from "@/pages/Cookies";
import TaxAdvisor from "@/pages/TaxAdvisor";
import Translator from "@/pages/Translator";
import Laws from "@/pages/Laws";
import TravelPlanning from "@/pages/TravelPlanning";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import Premium from "@/pages/Premium";
import Pricing from "@/pages/Pricing";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";

// Laws sub-pages
import MinimumWage from "@/pages/laws/MinimumWage";
import TaxClasses from "@/pages/laws/TaxClasses";
import HealthInsurance from "@/pages/laws/HealthInsurance";
import PensionInsurance from "@/pages/laws/PensionInsurance";
import MinimumHolidays from "@/pages/laws/MinimumHolidays";
import ParentalAllowance from "@/pages/laws/ParentalAllowance";
import LegalAid from "@/pages/laws/LegalAid";
import WorkContract from "@/pages/laws/WorkContract";
import TaxReturn from "@/pages/laws/TaxReturn";
import EmployeeProtection from "@/pages/laws/EmployeeProtection";
import ChildBenefits from "@/pages/laws/ChildBenefits";
import WorkingHours from "@/pages/laws/WorkingHours";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function AppContent() {
  const { trackPageView, trackError } = useAnalytics();
  usePerformanceOptimization();

  useEffect(() => {
    // Track page views
    const handleLocationChange = () => {
      trackPageView(window.location.pathname);
    };

    // Initial page view
    handleLocationChange();

    // Listen for navigation changes
    window.addEventListener('popstate', handleLocationChange);
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      performanceMonitor.destroy();
    };
  }, [trackPageView]);

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    trackError(error, errorInfo);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <div className="min-h-screen bg-background">
        <ScrollToTop />
        <LayoutWrapper>
          <Routes>
            {/* Main pages */}
            <Route path="/" element={<UnifiedHomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/translator" element={<Translator />} />
            <Route path="/tax-advisor" element={<TaxAdvisor />} />
            <Route path="/laws" element={<Laws />} />
            <Route path="/travel-planning" element={<TravelPlanning />} />
            
            {/* Laws sub-pages */}
            <Route path="/laws/minimum-wage" element={<MinimumWage />} />
            <Route path="/laws/tax-classes" element={<TaxClasses />} />
            <Route path="/laws/health-insurance" element={<HealthInsurance />} />
            <Route path="/laws/work-contract" element={<WorkContract />} />
            <Route path="/laws/tax-return" element={<TaxReturn />} />
            <Route path="/laws/pension-insurance" element={<PensionInsurance />} />
            <Route path="/laws/employee-protection" element={<EmployeeProtection />} />
            <Route path="/laws/child-benefits" element={<ChildBenefits />} />
            <Route path="/laws/working-hours" element={<WorkingHours />} />
            <Route path="/laws/minimum-holidays" element={<MinimumHolidays />} />
            <Route path="/laws/parental-allowance" element={<ParentalAllowance />} />
            <Route path="/laws/legal-aid" element={<LegalAid />} />
            
            {/* Auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Profile pages */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile-unified" element={<UnifiedProfile />} />
            <Route path="/profile-extended" element={<ProfileExtended />} />
            <Route path="/profile-extended/:userId" element={<ProfileExtended />} />
            
            {/* Admin page */}
            <Route path="/admin" element={<Admin />} />
            
            {/* Premium and Pricing pages */}
            <Route path="/premium" element={<Premium />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Support pages */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Legal pages */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            
            {/* Lazy loaded routes */}
            <Route 
              path="/shifts" 
              element={
                <LazyLoadWrapper>
                  <LazyShiftsModule />
                </LazyLoadWrapper>
              } 
            />
            <Route 
              path="/calculator" 
              element={
                <LazyLoadWrapper>
                  <LazyCalculatorModule />
                </LazyLoadWrapper>
              } 
            />
            <Route 
              path="/vehicle" 
              element={
                <LazyLoadWrapper>
                  <LazyVehicleModule />
                </LazyLoadWrapper>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <LazyLoadWrapper>
                  <LazySettingsModule />
                </LazyLoadWrapper>
              } 
            />
            
            {/* 404 fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LayoutWrapper>
        
        <PWAInstallPrompt />
        <Toaster position="bottom-right" />
        <ToasterTwo />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <AppContent />
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
