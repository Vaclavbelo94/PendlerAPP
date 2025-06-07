
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { OptimizedProviderStack } from '@/components/providers/OptimizedProviderStack';
import SimpleLoadingSpinner from '@/components/loading/SimpleLoadingSpinner';
import LayoutWrapper from '@/components/layouts/LayoutWrapper';
import ScrollToTop from '@/components/navigation/ScrollToTop';

// Critical pages - load immediately
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// Non-critical pages - lazy load
const Vocabulary = lazy(() => import('@/pages/Vocabulary'));
const Shifts = lazy(() => import('@/pages/Shifts'));
const Calculator = lazy(() => import('@/pages/Calculator'));
const Translator = lazy(() => import('@/pages/Translator'));
const Vehicle = lazy(() => import('@/pages/Vehicle'));
const TaxAdvisor = lazy(() => import('@/pages/TaxAdvisor'));
const TravelPlanning = lazy(() => import('@/pages/TravelPlanning'));
const Laws = lazy(() => import('@/pages/Laws'));
const Settings = lazy(() => import('@/pages/Settings'));
const Profile = lazy(() => import('@/pages/Profile'));
const Premium = lazy(() => import('@/pages/Premium'));
const Contact = lazy(() => import('@/pages/Contact'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const Admin = lazy(() => import('@/pages/Admin'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Cookies = lazy(() => import('@/pages/Cookies'));
const Terms = lazy(() => import('@/pages/Terms'));

// Lazy load law pages
const ChildBenefits = lazy(() => import('@/pages/laws/ChildBenefits'));
const EmployeeProtection = lazy(() => import('@/pages/laws/EmployeeProtection'));
const HealthInsurance = lazy(() => import('@/pages/laws/HealthInsurance'));
const LegalAid = lazy(() => import('@/pages/laws/LegalAid'));
const MinimumHolidays = lazy(() => import('@/pages/laws/MinimumHolidays'));
const MinimumWage = lazy(() => import('@/pages/laws/MinimumWage'));
const ParentalAllowance = lazy(() => import('@/pages/laws/ParentalAllowance'));
const PensionInsurance = lazy(() => import('@/pages/laws/PensionInsurance'));
const TaxClasses = lazy(() => import('@/pages/laws/TaxClasses'));
const TaxReturn = lazy(() => import('@/pages/laws/TaxReturn'));
const WorkContract = lazy(() => import('@/pages/laws/WorkContract'));
const WorkingHours = lazy(() => import('@/pages/laws/WorkingHours'));

// Lazy load optimizers and components
const RouteOptimizer = lazy(() => import('@/components/optimized/RouteOptimizer').then(m => ({ default: m.RouteOptimizer })));
const DatabaseOptimizer = lazy(() => import('@/components/optimized/DatabaseOptimizer').then(m => ({ default: m.DatabaseOptimizer })));
const CookieConsentBanner = lazy(() => import('@/components/gdpr/CookieConsentBanner').then(m => ({ default: m.CookieConsentBanner })));

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');
  
  // Disable analytics/ads for auth pages for faster loading
  const enableAnalytics = !isAuthPage;
  const enableAds = !isAuthPage;

  return (
    <OptimizedProviderStack enableAnalytics={enableAnalytics} enableAds={enableAds}>
      <ScrollToTop />
      
      <Suspense fallback={<SimpleLoadingSpinner />}>
        <DatabaseOptimizer />
        <RouteOptimizer>
          <LayoutWrapper>
            <Suspense fallback={<SimpleLoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/vocabulary" element={<Vocabulary />} />
                <Route path="/shifts" element={<Shifts />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/translator" element={<Translator />} />
                <Route path="/vehicle" element={<Vehicle />} />
                <Route path="/tax-advisor" element={<TaxAdvisor />} />
                <Route path="/travel" element={<TravelPlanning />} />
                <Route path="/laws" element={<Laws />} />
                
                {/* Law detail pages */}
                <Route path="/laws/child-benefits" element={<ChildBenefits />} />
                <Route path="/laws/employee-protection" element={<EmployeeProtection />} />
                <Route path="/laws/health-insurance" element={<HealthInsurance />} />
                <Route path="/laws/legal-aid" element={<LegalAid />} />
                <Route path="/laws/minimum-holidays" element={<MinimumHolidays />} />
                <Route path="/laws/minimum-wage" element={<MinimumWage />} />
                <Route path="/laws/parental-allowance" element={<ParentalAllowance />} />
                <Route path="/laws/pension-insurance" element={<PensionInsurance />} />
                <Route path="/laws/tax-classes" element={<TaxClasses />} />
                <Route path="/laws/tax-return" element={<TaxReturn />} />
                <Route path="/laws/work-contract" element={<WorkContract />} />
                <Route path="/laws/working-hours" element={<WorkingHours />} />
                
                {/* Legal pages */}
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/terms" element={<Terms />} />
                
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/pricing" element={<Navigate to="/premium" replace />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>
          </LayoutWrapper>
        </RouteOptimizer>
        
        <CookieConsentBanner />
      </Suspense>
    </OptimizedProviderStack>
  );
};

function App() {
  return <AppRoutes />;
}

export default App;
