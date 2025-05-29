
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorBoundaryWithFallback';
import { LoadingFallback } from '@/components/common/LoadingFallback';

// Main pages
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import Premium from "@/pages/Premium";
import PremiumSuccess from "@/pages/PremiumSuccess";
import NotFound from "@/pages/NotFound";

// App sections
import Shifts from '@/pages/Shifts';
import Vocabulary from '@/pages/Vocabulary';
import Calculator from '@/pages/Calculator';
import Translator from '@/pages/Translator';
import TaxAdvisor from '@/pages/TaxAdvisor';
import Vehicle from '@/pages/Vehicle';
import TravelPlanning from '@/pages/TravelPlanning';
import CommutingMap from '@/pages/CommutingMap';
import LegalAssistant from '@/pages/LegalAssistant';
import Laws from '@/pages/Laws';
import Settings from '@/pages/Settings';

// Legal pages
import RentalAgreement from '@/pages/legal/RentalAgreement';
import LegalStatus from '@/pages/legal/LegalStatus';
import SocialSecurity from '@/pages/legal/SocialSecurity';
import WorkContract from '@/pages/legal/WorkContract';

// Laws pages
import MinimumWage from '@/pages/laws/MinimumWage';
import WorkingHours from '@/pages/laws/WorkingHours';
import TaxClasses from '@/pages/laws/TaxClasses';
import TaxReturn from '@/pages/laws/TaxReturn';
import HealthInsurance from '@/pages/laws/HealthInsurance';
import PensionInsurance from '@/pages/laws/PensionInsurance';
import ChildBenefits from '@/pages/laws/ChildBenefits';
import ParentalAllowance from '@/pages/laws/ParentalAllowance';
import MinimumHolidays from '@/pages/laws/MinimumHolidays';
import EmployeeProtection from '@/pages/laws/EmployeeProtection';
import LegalAid from '@/pages/laws/LegalAid';
import WorkContractLaw from '@/pages/laws/WorkContract';

// Auxiliary pages
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Cookies from '@/pages/Cookies';
import Pricing from '@/pages/Pricing';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <AccessibilityProvider>
            <ErrorBoundaryWithFallback>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Main routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/premium" element={<Premium />} />
                  <Route path="/premium/success" element={<PremiumSuccess />} />
                  <Route path="/settings" element={<Settings />} />

                  {/* App sections */}
                  <Route path="/shifts" element={<Shifts />} />
                  <Route path="/vocabulary" element={<Vocabulary />} />
                  <Route path="/calculator" element={<Calculator />} />
                  <Route path="/translator" element={<Translator />} />
                  <Route path="/tax-advisor" element={<TaxAdvisor />} />
                  <Route path="/vehicle" element={<Vehicle />} />
                  <Route path="/travel" element={<TravelPlanning />} />
                  <Route path="/commuting-map" element={<CommutingMap />} />
                  <Route path="/legal-assistant" element={<LegalAssistant />} />
                  <Route path="/laws" element={<Laws />} />

                  {/* Legal pages */}
                  <Route path="/legal/rental-agreement" element={<RentalAgreement />} />
                  <Route path="/legal/status" element={<LegalStatus />} />
                  <Route path="/legal/social-security" element={<SocialSecurity />} />
                  <Route path="/legal/work-contract" element={<WorkContract />} />

                  {/* Laws pages */}
                  <Route path="/laws/minimum-wage" element={<MinimumWage />} />
                  <Route path="/laws/working-hours" element={<WorkingHours />} />
                  <Route path="/laws/tax-classes" element={<TaxClasses />} />
                  <Route path="/laws/tax-return" element={<TaxReturn />} />
                  <Route path="/laws/health-insurance" element={<HealthInsurance />} />
                  <Route path="/laws/pension-insurance" element={<PensionInsurance />} />
                  <Route path="/laws/child-benefits" element={<ChildBenefits />} />
                  <Route path="/laws/parental-allowance" element={<ParentalAllowance />} />
                  <Route path="/laws/minimum-holidays" element={<MinimumHolidays />} />
                  <Route path="/laws/employee-protection" element={<EmployeeProtection />} />
                  <Route path="/laws/legal-aid" element={<LegalAid />} />
                  <Route path="/laws/work-contract" element={<WorkContractLaw />} />

                  {/* Auxiliary pages */}
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/pricing" element={<Pricing />} />

                  {/* 404 page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundaryWithFallback>
          </AccessibilityProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
