import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './i18n/config'; // Initialize i18next

// Critical pages - load immediately
import ModernIndex from '@/pages/ModernIndex';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// Non-critical pages - lazy load
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Shifts = lazy(() => import('@/pages/Shifts'));
const Translator = lazy(() => import('@/pages/Translator'));
const Vehicle = lazy(() => import('@/pages/Vehicle'));
const TaxAdvisor = lazy(() => import('@/pages/TaxAdvisor'));
const TravelPlanning = lazy(() => import('@/pages/TravelPlanning'));
const Laws = lazy(() => import('@/pages/Laws'));
const Settings = lazy(() => import('@/pages/Settings'));
const Profile = lazy(() => import('@/pages/Profile'));
const Premium = lazy(() => import('@/pages/Premium'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const Contact = lazy(() => import('@/pages/Contact'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const Admin = lazy(() => import('@/pages/Admin'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Cookies = lazy(() => import('@/pages/Cookies'));
const Terms = lazy(() => import('@/pages/Terms'));

// Law detail pages
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

import { GlobalPerformanceProvider } from '@/components/optimized/GlobalPerformanceProvider';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/hooks/auth';
import { ThemeProvider } from '@/hooks/useTheme';
import { Toaster } from './components/ui/toaster';

// Create QueryClient instance outside component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
    },
  },
});

// Enhanced loading fallback
const AppLoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
      <p className="text-sm text-muted-foreground">Načítání...</p>
    </div>
  </div>
);

// Safe lazy component wrapper
const SafeLazyRoute = ({ Component }: { Component: React.ComponentType }) => (
  <Suspense fallback={<AppLoadingFallback />}>
    <Component />
  </Suspense>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GlobalPerformanceProvider>
          <AuthProvider>
            <ThemeProvider>
              <Toaster />
              <Suspense fallback={<AppLoadingFallback />}>
                <Routes>
                  <Route path="/" element={<ModernIndex />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  <Route path="/dashboard" element={<SafeLazyRoute Component={Dashboard} />} />
                  <Route path="/shifts" element={<SafeLazyRoute Component={Shifts} />} />
                  <Route path="/translator" element={<SafeLazyRoute Component={Translator} />} />
                  <Route path="/vehicle" element={<SafeLazyRoute Component={Vehicle} />} />
                  <Route path="/tax-advisor" element={<SafeLazyRoute Component={TaxAdvisor} />} />
                  <Route path="/travel" element={<SafeLazyRoute Component={TravelPlanning} />} />
                  <Route path="/laws" element={<SafeLazyRoute Component={Laws} />} />
                  
                  {/* Redirect old vocabulary route to translator */}
                  <Route path="/vocabulary" element={<Navigate to="/translator" replace />} />
                  
                  {/* Law detail pages */}
                  <Route path="/laws/child-benefits" element={<SafeLazyRoute Component={ChildBenefits} />} />
                  <Route path="/laws/employee-protection" element={<SafeLazyRoute Component={EmployeeProtection} />} />
                  <Route path="/laws/health-insurance" element={<SafeLazyRoute Component={HealthInsurance} />} />
                  <Route path="/laws/legal-aid" element={<SafeLazyRoute Component={LegalAid} />} />
                  <Route path="/laws/minimum-holidays" element={<SafeLazyRoute Component={MinimumHolidays} />} />
                  <Route path="/laws/minimum-wage" element={<SafeLazyRoute Component={MinimumWage} />} />
                  <Route path="/laws/parental-allowance" element={<SafeLazyRoute Component={ParentalAllowance} />} />
                  <Route path="/laws/pension-insurance" element={<SafeLazyRoute Component={PensionInsurance} />} />
                  <Route path="/laws/tax-classes" element={<SafeLazyRoute Component={TaxClasses} />} />
                  <Route path="/laws/tax-return" element={<SafeLazyRoute Component={TaxReturn} />} />
                  <Route path="/laws/work-contract" element={<SafeLazyRoute Component={WorkContract} />} />
                  <Route path="/laws/working-hours" element={<SafeLazyRoute Component={WorkingHours} />} />
                  
                  {/* Legal pages */}
                  <Route path="/privacy" element={<SafeLazyRoute Component={Privacy} />} />
                  <Route path="/cookies" element={<SafeLazyRoute Component={Cookies} />} />
                  <Route path="/terms" element={<SafeLazyRoute Component={Terms} />} />
                  
                  <Route path="/settings" element={<SafeLazyRoute Component={Settings} />} />
                  <Route path="/profile" element={<SafeLazyRoute Component={Profile} />} />
                  <Route path="/premium" element={<SafeLazyRoute Component={Premium} />} />
                  <Route path="/pricing" element={<SafeLazyRoute Component={Pricing} />} />
                  <Route path="/contact" element={<SafeLazyRoute Component={Contact} />} />
                  <Route path="/faq" element={<SafeLazyRoute Component={FAQ} />} />
                  <Route path="/admin" element={<SafeLazyRoute Component={Admin} />} />
                </Routes>
              </Suspense>
            </ThemeProvider>
          </AuthProvider>
        </GlobalPerformanceProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
