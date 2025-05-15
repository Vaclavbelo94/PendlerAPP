
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Language from "./pages/Language";
import Laws from "./pages/Laws";
import Vehicle from "./pages/Vehicle";
import Shifts from "./pages/Shifts";
import Calculator from "./pages/Calculator";
import TranslatorPage from "./pages/Translator";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Premium from "./pages/Premium";
import LayoutWrapper from "./components/layouts/LayoutWrapper";
import { ShiftNotifications } from "./components/notifications/ShiftNotifications";
import OfflineIndicator from "./components/offlineMode/OfflineIndicator";
import OfflineSyncManager from "./components/offlineMode/OfflineSyncManager";

// Law detail pages
import MinimumWage from "./pages/laws/MinimumWage";
import TaxClasses from "./pages/laws/TaxClasses";
import HealthInsurance from "./pages/laws/HealthInsurance";
import WorkContract from "./pages/laws/WorkContract";
import TaxReturn from "./pages/laws/TaxReturn";
import PensionInsurance from "./pages/laws/PensionInsurance";
import EmployeeProtection from "./pages/laws/EmployeeProtection";
import ChildBenefits from "./pages/laws/ChildBenefits";

import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Enable offline caching of query results
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
      staleTime: 1000 * 60 * 60, // 1 hour
      retry: (failureCount, error) => {
        // Don't retry if we're offline
        if (!navigator.onLine) return false;
        return failureCount < 3;
      }
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" closeButton />
        <BrowserRouter>
          <ShiftNotifications />
          <OfflineSyncManager />
          <OfflineIndicator />
          <Routes>
            <Route path="/" element={<LayoutWrapper><Index /></LayoutWrapper>} />
            <Route path="/language" element={<LayoutWrapper><Language /></LayoutWrapper>} />
            <Route path="/laws" element={<LayoutWrapper><Laws /></LayoutWrapper>} />
            <Route path="/vehicle" element={<LayoutWrapper><Vehicle /></LayoutWrapper>} />
            <Route path="/shifts" element={<LayoutWrapper><Shifts /></LayoutWrapper>} />
            <Route path="/calculator" element={<LayoutWrapper><Calculator /></LayoutWrapper>} />
            <Route path="/translator" element={<LayoutWrapper><TranslatorPage /></LayoutWrapper>} />
            <Route path="/login" element={<LayoutWrapper><Login /></LayoutWrapper>} />
            <Route path="/register" element={<LayoutWrapper><Register /></LayoutWrapper>} />
            <Route path="/profile" element={<LayoutWrapper><Profile /></LayoutWrapper>} />
            <Route path="/premium" element={<LayoutWrapper><Premium /></LayoutWrapper>} />
            <Route path="/about" element={<LayoutWrapper><About /></LayoutWrapper>} />
            <Route path="/contact" element={<LayoutWrapper><Contact /></LayoutWrapper>} />
            <Route path="/faq" element={<LayoutWrapper><FAQ /></LayoutWrapper>} />
            <Route path="/terms" element={<LayoutWrapper><Terms /></LayoutWrapper>} />
            <Route path="/privacy" element={<LayoutWrapper><Privacy /></LayoutWrapper>} />
            <Route path="/cookies" element={<LayoutWrapper><Cookies /></LayoutWrapper>} />
            <Route path="/admin" element={<LayoutWrapper><Admin /></LayoutWrapper>} />
            
            {/* Law detail pages */}
            <Route path="/laws/minimum-wage" element={<LayoutWrapper><MinimumWage /></LayoutWrapper>} />
            <Route path="/laws/tax-classes" element={<LayoutWrapper><TaxClasses /></LayoutWrapper>} />
            <Route path="/laws/health-insurance" element={<LayoutWrapper><HealthInsurance /></LayoutWrapper>} />
            <Route path="/laws/work-contract" element={<LayoutWrapper><WorkContract /></LayoutWrapper>} />
            <Route path="/laws/tax-return" element={<LayoutWrapper><TaxReturn /></LayoutWrapper>} />
            <Route path="/laws/pension-insurance" element={<LayoutWrapper><PensionInsurance /></LayoutWrapper>} />
            <Route path="/laws/employee-protection" element={<LayoutWrapper><EmployeeProtection /></LayoutWrapper>} />
            <Route path="/laws/child-benefits" element={<LayoutWrapper><ChildBenefits /></LayoutWrapper>} />
            
            <Route path="*" element={<LayoutWrapper><NotFound /></LayoutWrapper>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
