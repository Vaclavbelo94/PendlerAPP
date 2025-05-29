import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorBoundaryWithFallback';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import LayoutWrapper from '@/components/layouts/LayoutWrapper';

// Main pages
import UnifiedHomePage from '@/pages/UnifiedHomePage';
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
        <ThemeProvider>
          <AuthProvider>
            <AccessibilityProvider>
              <ErrorBoundaryWithFallback>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Main routes */}
                    <Route path="/" element={<LayoutWrapper><UnifiedHomePage /></LayoutWrapper>} />
                    <Route path="/dashboard" element={<LayoutWrapper><Dashboard /></LayoutWrapper>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<LayoutWrapper><Profile /></LayoutWrapper>} />
                    <Route path="/admin" element={<LayoutWrapper><Admin /></LayoutWrapper>} />
                    <Route path="/premium" element={<LayoutWrapper><Premium /></LayoutWrapper>} />
                    <Route path="/premium/success" element={<LayoutWrapper><PremiumSuccess /></LayoutWrapper>} />
                    <Route path="/settings" element={<LayoutWrapper><Settings /></LayoutWrapper>} />

                    {/* App sections */}
                    <Route path="/shifts" element={<LayoutWrapper><Shifts /></LayoutWrapper>} />
                    <Route path="/vocabulary" element={<LayoutWrapper><Vocabulary /></LayoutWrapper>} />
                    <Route path="/calculator" element={<LayoutWrapper><Calculator /></LayoutWrapper>} />
                    <Route path="/translator" element={<LayoutWrapper><Translator /></LayoutWrapper>} />
                    <Route path="/tax-advisor" element={<LayoutWrapper><TaxAdvisor /></LayoutWrapper>} />
                    <Route path="/vehicle" element={<LayoutWrapper><Vehicle /></LayoutWrapper>} />
                    <Route path="/travel" element={<LayoutWrapper><TravelPlanning /></LayoutWrapper>} />
                    <Route path="/commuting-map" element={<LayoutWrapper><CommutingMap /></LayoutWrapper>} />
                    <Route path="/legal-assistant" element={<LayoutWrapper><LegalAssistant /></LayoutWrapper>} />
                    <Route path="/laws" element={<LayoutWrapper><Laws /></LayoutWrapper>} />

                    {/* Legal pages */}
                    <Route path="/legal/rental-agreement" element={<LayoutWrapper><RentalAgreement /></LayoutWrapper>} />
                    <Route path="/legal/status" element={<LayoutWrapper><LegalStatus /></LayoutWrapper>} />
                    <Route path="/legal/social-security" element={<LayoutWrapper><SocialSecurity /></LayoutWrapper>} />
                    <Route path="/legal/work-contract" element={<LayoutWrapper><WorkContract /></LayoutWrapper>} />

                    {/* Laws pages */}
                    <Route path="/laws/minimum-wage" element={<LayoutWrapper><MinimumWage /></LayoutWrapper>} />
                    <Route path="/laws/working-hours" element={<LayoutWrapper><WorkingHours /></LayoutWrapper>} />
                    <Route path="/laws/tax-classes" element={<LayoutWrapper><TaxClasses /></LayoutWrapper>} />
                    <Route path="/laws/tax-return" element={<LayoutWrapper><TaxReturn /></LayoutWrapper>} />
                    <Route path="/laws/health-insurance" element={<LayoutWrapper><HealthInsurance /></LayoutWrapper>} />
                    <Route path="/laws/pension-insurance" element={<LayoutWrapper><PensionInsurance /></LayoutWrapper>} />
                    <Route path="/laws/child-benefits" element={<LayoutWrapper><ChildBenefits /></LayoutWrapper>} />
                    <Route path="/laws/parental-allowance" element={<LayoutWrapper><ParentalAllowance /></LayoutWrapper>} />
                    <Route path="/laws/minimum-holidays" element={<LayoutWrapper><MinimumHolidays /></LayoutWrapper>} />
                    <Route path="/laws/employee-protection" element={<LayoutWrapper><EmployeeProtection /></LayoutWrapper>} />
                    <Route path="/laws/legal-aid" element={<LayoutWrapper><LegalAid /></LayoutWrapper>} />
                    <Route path="/laws/work-contract" element={<LayoutWrapper><WorkContractLaw /></LayoutWrapper>} />

                    {/* Auxiliary pages */}
                    <Route path="/about" element={<LayoutWrapper><About /></LayoutWrapper>} />
                    <Route path="/contact" element={<LayoutWrapper><Contact /></LayoutWrapper>} />
                    <Route path="/faq" element={<LayoutWrapper><FAQ /></LayoutWrapper>} />
                    <Route path="/privacy" element={<LayoutWrapper><Privacy /></LayoutWrapper>} />
                    <Route path="/terms" element={<LayoutWrapper><Terms /></LayoutWrapper>} />
                    <Route path="/cookies" element={<LayoutWrapper><Cookies /></LayoutWrapper>} />
                    <Route path="/pricing" element={<LayoutWrapper><Pricing /></LayoutWrapper>} />

                    {/* 404 page */}
                    <Route path="*" element={<LayoutWrapper><NotFound /></LayoutWrapper>} />
                  </Routes>
                </Suspense>
              </ErrorBoundaryWithFallback>
            </AccessibilityProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
