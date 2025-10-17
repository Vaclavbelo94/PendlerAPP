
import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/auth";
import { DHLThemeProvider } from "@/contexts/DHLThemeContext";
import { MobileProvider } from "@/contexts/MobileContext";
import { CompanyModuleProvider } from "@/components/company/CompanyModuleProvider";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { NotificationManager } from "./components/notifications/NotificationManager";
import { PerformanceOptimizer } from "./components/performance/PerformanceOptimizer";
import WelcomeScreen from "./components/welcome/WelcomeScreen";
import { lazyLoadWithRetry } from "./utils/lazyLoad";
import "./i18n/config";
import './index.css';
import './styles/mobile-touch.css';

// Lazy load all pages for better performance
const Index = lazyLoadWithRetry(() => import("./pages/Index"));
const CompanySelector = lazy(() => import("./components/company/CompanySelector"));
const CompanyLandingPage = lazy(() => import("./components/company/CompanyLandingPage"));
const CompanyRegister = lazy(() => import("./components/company/CompanyRegister"));
const Login = lazyLoadWithRetry(() => import("./pages/Login"));
const Register = lazyLoadWithRetry(() => import("./pages/Register"));
const Dashboard = lazyLoadWithRetry(() => import("./pages/Dashboard"));
const Shifts = lazyLoadWithRetry(() => import("./pages/Shifts"));
const Overtime = lazy(() => import("./pages/Overtime"));
const TravelPlanning = lazy(() => import("./pages/TravelPlanning"));
const Translator = lazy(() => import("./pages/Translator"));
const TaxAdvisor = lazy(() => import("./pages/TaxAdvisor"));
const PendlerCalculatorPage = lazy(() => import("./pages/PendlerCalculator"));
const WageOverview = lazy(() => import("./pages/WageOverview"));
const Laws = lazy(() => import("./pages/Laws"));
const LawDetail = lazy(() => import("./pages/LawDetail"));
const ModernProfile = lazy(() => import("./pages/ModernProfile"));
const Settings = lazy(() => import("./pages/Settings"));
const Vehicle = lazy(() => import("./pages/Vehicle"));
const Premium = lazy(() => import("./pages/Premium"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminV2 = lazy(() => import("./pages/AdminV2"));
const MobileAdminV2 = lazy(() => import("./pages/MobileAdminV2"));
const DHLSetup = lazy(() => import("./pages/DHLSetup"));
const DHLAdmin = lazy(() => import("./pages/DHLAdmin"));
const DHLEmployeePage = lazy(() => import("./pages/dhl/employee/DHLEmployeePage"));
const DHLDocumentsPage = lazy(() => import("./pages/dhl/DHLDocumentsPage"));
const DHLTravelPage = lazy(() => import("./pages/dhl/DHLTravelPage"));
const DHLAnalyticsPage = lazy(() => import("./pages/dhl/DHLAnalyticsPage"));
const DHLTimeTrackingPage = lazy(() => import("./pages/dhl/DHLTimeTrackingPage"));
const DHLRecruitment = lazy(() => import("./pages/DHLRecruitment"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <MobileProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <BrowserRouter>
                <AuthProvider>
                  <DHLThemeProvider>
                    <CompanyModuleProvider>
                      <Suspense fallback={<LoadingSpinner />}>
                       <Routes>
                          <Route path="/" element={<WelcomeScreen />} />
                          <Route path="/welcome" element={<WelcomeScreen />} />
                          <Route path="/company-selector" element={<CompanySelector />} />
                          <Route path="/adecco" element={<CompanyLandingPage />} />
                          <Route path="/randstad" element={<CompanyLandingPage />} />
                          <Route path="/dhl" element={<CompanyLandingPage />} />
                          <Route path="/register/:company" element={<CompanyRegister />} />
                           <Route path="/old-index" element={<Index />} />
                           <Route path="/login" element={<Login />} />
                           <Route path="/forgot-password" element={<ForgotPassword />} />
                           <Route path="/register" element={<Register />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/shifts" element={<Shifts />} />
                          <Route path="/notifications" element={<NotificationsPage />} />
                          <Route path="/overtime" element={<Overtime />} />
                          <Route path="/travel" element={<TravelPlanning />} />
                          <Route path="/translator" element={<Translator />} />
                          <Route path="/tax-advisor" element={<TaxAdvisor />} />
                          <Route path="/pendler-calculator" element={<PendlerCalculatorPage />} />
                          <Route path="/wage-overview" element={<WageOverview />} />
                          <Route path="/laws" element={<Laws />} />
                          <Route path="/laws/:lawId" element={<LawDetail />} />
                          <Route path="/profile" element={<ModernProfile />} />
                          <Route path="/settings" element={<Settings />} />
                           <Route path="/vehicle" element={<Vehicle />} />
                           <Route path="/premium" element={<Premium />} />
                           <Route path="/pricing" element={<Pricing />} />
                           <Route path="/contact" element={<Contact />} />
                           <Route path="/faq" element={<FAQ />} />
                           <Route path="/terms" element={<Terms />} />
                           <Route path="/privacy" element={<Privacy />} />
                           <Route path="/admin" element={<Admin />} />
          <Route path="/admin/v2/*" element={<AdminV2 />} />
          <Route path="/admin/mobile/*" element={<MobileAdminV2 />} />
                           <Route path="/dhl-admin" element={<DHLAdmin />} />
                           <Route path="/dhl-setup" element={<DHLSetup />} />
                           <Route path="/dhl-employee" element={<DHLEmployeePage />} />
                           <Route path="/dhl-documents" element={<DHLDocumentsPage />} />
                           <Route path="/dhl-travel" element={<DHLTravelPage />} />
                           <Route path="/dhl-analytics" element={<DHLAnalyticsPage />} />
                           <Route path="/dhl-time-tracking" element={<DHLTimeTrackingPage />} />
                           <Route path="/dhl-recruitment" element={<DHLRecruitment />} />
                        </Routes>
                        </Suspense>
                       <PerformanceOptimizer />
                       <NotificationManager />
                       <Toaster />
                       <SonnerToaster position="top-right" />
                    </CompanyModuleProvider>
                  </DHLThemeProvider>
                </AuthProvider>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </MobileProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
