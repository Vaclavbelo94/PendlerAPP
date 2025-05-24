
import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Layout from "./components/layouts/Layout";
import { AuthProvider } from "./hooks/auth";

// Lazy loading všech stránek pro lepší výkon
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Language = lazy(() => import("./pages/Language"));
const Shifts = lazy(() => import("./pages/Shifts"));
const Calculator = lazy(() => import("./pages/Calculator"));
const Vehicle = lazy(() => import("./pages/Vehicle"));
const TaxAdvisor = lazy(() => import("./pages/TaxAdvisor"));
const TravelPlanning = lazy(() => import("./pages/TravelPlanning"));
const CommutingMap = lazy(() => import("./pages/CommutingMap"));
const Profile = lazy(() => import("./pages/Profile"));
const ProfileExtended = lazy(() => import("./pages/ProfileExtended"));
const Translator = lazy(() => import("./pages/Translator"));
const Premium = lazy(() => import("./pages/Premium"));
const Admin = lazy(() => import("./pages/Admin"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LegalAssistant = lazy(() => import("./pages/LegalAssistant"));
const Laws = lazy(() => import("./pages/Laws"));

// Law pages
const TaxReturn = lazy(() => import("./pages/laws/TaxReturn"));
const WorkContract = lazy(() => import("./pages/laws/WorkContract"));
const HealthInsurance = lazy(() => import("./pages/laws/HealthInsurance"));
const PensionInsurance = lazy(() => import("./pages/laws/PensionInsurance"));
const MinimumWage = lazy(() => import("./pages/laws/MinimumWage"));
const WorkingHours = lazy(() => import("./pages/laws/WorkingHours"));
const MinimumHolidays = lazy(() => import("./pages/laws/MinimumHolidays"));
const EmployeeProtection = lazy(() => import("./pages/laws/EmployeeProtection"));
const TaxClasses = lazy(() => import("./pages/laws/TaxClasses"));
const ChildBenefits = lazy(() => import("./pages/laws/ChildBenefits"));
const ParentalAllowance = lazy(() => import("./pages/laws/ParentalAllowance"));

// Legal pages
const LegalStatus = lazy(() => import("./pages/legal/LegalStatus"));
const SocialSecurity = lazy(() => import("./pages/legal/SocialSecurity"));
const WorkContractLegal = lazy(() => import("./pages/legal/WorkContract"));
const RentalAgreement = lazy(() => import("./pages/legal/RentalAgreement"));

const DesignSystem = lazy(() => import("./pages/DesignSystem"));

// Loading component pro lazy loaded stránky
const PageSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minut
      gcTime: 10 * 60 * 1000, // 10 minut (dříve cacheTime)
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <Layout>
                <Suspense fallback={<PageSkeleton />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/language" element={<Language />} />
                    <Route path="/shifts" element={<Shifts />} />
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="/vehicle" element={<Vehicle />} />
                    <Route path="/tax-advisor" element={<TaxAdvisor />} />
                    <Route path="/travel" element={<TravelPlanning />} />
                    <Route path="/commuting-map" element={<CommutingMap />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile-extended" element={<ProfileExtended />} />
                    <Route path="/translator" element={<Translator />} />
                    <Route path="/premium" element={<Premium />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/legal-assistant" element={<LegalAssistant />} />
                    <Route path="/laws" element={<Laws />} />
                    
                    {/* Law routes */}
                    <Route path="/laws/tax-return" element={<TaxReturn />} />
                    <Route path="/laws/work-contract" element={<WorkContract />} />
                    <Route path="/laws/health-insurance" element={<HealthInsurance />} />
                    <Route path="/laws/pension-insurance" element={<PensionInsurance />} />
                    <Route path="/laws/minimum-wage" element={<MinimumWage />} />
                    <Route path="/laws/working-hours" element={<WorkingHours />} />
                    <Route path="/laws/minimum-holidays" element={<MinimumHolidays />} />
                    <Route path="/laws/employee-protection" element={<EmployeeProtection />} />
                    <Route path="/laws/tax-classes" element={<TaxClasses />} />
                    <Route path="/laws/child-benefits" element={<ChildBenefits />} />
                    <Route path="/laws/parental-allowance" element={<ParentalAllowance />} />
                    
                    {/* Legal routes */}
                    <Route path="/legal/legal-status" element={<LegalStatus />} />
                    <Route path="/legal/social-security" element={<SocialSecurity />} />
                    <Route path="/legal/work-contract" element={<WorkContractLegal />} />
                    <Route path="/legal/rental-agreement" element={<RentalAgreement />} />
                    
                    <Route path="/design-system" element={<DesignSystem />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </Layout>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
