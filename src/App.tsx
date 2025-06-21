

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/components/providers/LanguageProvider';

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

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GlobalPerformanceProvider>
          <LanguageProvider>
            <AuthProvider>
              <ThemeProvider>
                <Toaster />
                <Routes>
                  <Route path="/" element={<ModernIndex />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/shifts" element={<Shifts />} />
                  <Route path="/translator" element={<Translator />} />
                  <Route path="/vehicle" element={<Vehicle />} />
                  <Route path="/tax-advisor" element={<TaxAdvisor />} />
                  <Route path="/travel" element={<TravelPlanning />} />
                  <Route path="/laws" element={<Laws />} />
                  
                  {/* Redirect old vocabulary route to translator */}
                  <Route path="/vocabulary" element={<Navigate to="/translator" replace />} />
                  
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
              </ThemeProvider>
            </AuthProvider>
          </LanguageProvider>
        </GlobalPerformanceProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

