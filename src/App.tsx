
import { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/auth";
import { DHLThemeProvider } from "@/contexts/DHLThemeContext";
import { CompanyModuleProvider } from "@/components/company/CompanyModuleProvider";
import Index from "./pages/Index";
import CompanySelector from "./components/company/CompanySelector";
import CompanyLandingPage from "./components/company/CompanyLandingPage";
import CompanyRegister from "./components/company/CompanyRegister";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Shifts from "./pages/Shifts";
import Overtime from "./pages/Overtime";
import TravelPlanning from "./pages/TravelPlanning";
import Translator from "./pages/Translator";
import TaxAdvisor from "./pages/TaxAdvisor";
import Laws from "./pages/Laws";
import LawDetail from "./pages/LawDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Vehicle from "./pages/Vehicle";
import Premium from "./pages/Premium";
import PremiumGate from "./pages/PremiumGate";
import Admin from "./pages/Admin";
import AdminV2 from "./pages/AdminV2";
// DHL Routes - only setup and admin remain
import DHLSetup from "./pages/DHLSetup";
import DHLAdmin from "./pages/DHLAdmin"; // NEW DHL Admin route
import ForgotPassword from "./pages/ForgotPassword";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import WelcomeScreen from "./components/welcome/WelcomeScreen";
import "./i18n/config";

// Import manual premium activation utility
import "@/utils/manualPremiumActivation";
// Import promo code fix utility
import "@/utils/fixPromoCodeIssues";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
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
                        <Route path="/overtime" element={<Overtime />} />
                        <Route path="/travel" element={<TravelPlanning />} />
                        <Route path="/translator" element={<Translator />} />
                        <Route path="/tax-advisor" element={<TaxAdvisor />} />
                        <Route path="/laws" element={<Laws />} />
                        <Route path="/laws/:lawId" element={<LawDetail />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/vehicle" element={<Vehicle />} />
                        <Route path="/premium" element={<Premium />} />
                        <Route path="/premium-gate" element={<PremiumGate />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/admin/v2/*" element={<AdminV2 />} />
                        <Route path="/dhl-admin" element={<DHLAdmin />} />
                        <Route path="/dhl-setup" element={<DHLSetup />} />
                     </Routes>
                   </Suspense>
                    <Toaster />
                    <SonnerToaster position="top-right" />
                  </CompanyModuleProvider>
                </DHLThemeProvider>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
