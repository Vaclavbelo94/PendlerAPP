import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
import { AuthProvider } from '@/hooks/auth';
import LayoutWrapper from '@/components/layouts/LayoutWrapper';
import { useOptimizedSupabase } from '@/hooks/useOptimizedSupabase';

// Import all page components
import Index from '@/pages/Index';
import Home from '@/pages/Home';
import Pricing from '@/pages/Pricing';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Premium from '@/pages/Premium';
import PremiumSuccess from '@/pages/PremiumSuccess';
import FAQ from '@/pages/FAQ';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Cookies from '@/pages/Cookies';
import UnifiedHomePage from '@/pages/UnifiedHomePage';
import ModernIndex from '@/pages/ModernIndex';
import DesignSystem from '@/pages/DesignSystem';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import ProfileExtended from '@/pages/ProfileExtended';
import UnifiedProfile from '@/pages/UnifiedProfile';
import Shifts from '@/pages/Shifts';
import Translator from '@/pages/Translator';
import TravelPlanning from '@/pages/TravelPlanning';
import Vehicle from '@/pages/Vehicle';
import TaxAdvisor from '@/pages/TaxAdvisor';
import Laws from '@/pages/Laws';
import LegalAssistant from '@/pages/LegalAssistant';
import Settings from '@/pages/Settings';
import CommutingMap from '@/pages/CommutingMap';
import EmployeeProtection from '@/pages/laws/EmployeeProtection';
import ChildBenefits from '@/pages/laws/ChildBenefits';
import Admin from '@/pages/Admin';
import AdminPanel from '@/pages/AdminPanel';
import DHLDashboard from '@/pages/DHLDashboard';
import DHLAdmin from '@/pages/DHLAdmin';
import DHLSetup from '@/pages/DHLSetup';
import DHLShifts from '@/pages/DHLShifts';
import DHLProfile from '@/pages/DHLProfile';
import DHLVehicle from '@/pages/DHLVehicle';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { isLoading } = useOptimizedSupabase();

  // Show a loading indicator while Supabase is initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <Router>
      <AccessibilityProvider>
        <LayoutWrapper>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Home />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/premium-success" element={<PremiumSuccess />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/unified" element={<UnifiedHomePage />} />
              <Route path="/modern" element={<ModernIndex />} />
              <Route path="/design-system" element={<DesignSystem />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile-extended" element={<ProfileExtended />} />
              <Route path="/unified-profile" element={<UnifiedProfile />} />
              <Route path="/shifts" element={<Shifts />} />
              <Route path="/translator" element={<Translator />} />
              <Route path="/travel-planning" element={<TravelPlanning />} />
              <Route path="/vehicle" element={<Vehicle />} />
              <Route path="/tax-advisor" element={<TaxAdvisor />} />
              <Route path="/laws" element={<Laws />} />
              <Route path="/legal-assistant" element={<LegalAssistant />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/commuting-map" element={<CommutingMap />} />

              {/* Law-specific routes */}
              <Route path="/laws/employee-protection" element={<EmployeeProtection />} />
              <Route path="/laws/child-benefits" element={<ChildBenefits />} />

              {/* Admin routes */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin-panel" element={<AdminPanel />} />

              {/* DHL routes */}
              <Route path="/dhl-dashboard" element={<DHLDashboard />} />
              <Route path="/dhl-admin" element={<DHLAdmin />} />
              <Route path="/dhl-setup" element={<DHLSetup />} />
              <Route path="/dhl-shifts" element={<DHLShifts />} />
              <Route path="/dhl-profile" element={<DHLProfile />} />
              <Route path="/dhl-vehicle" element={<DHLVehicle />} />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </LayoutWrapper>
      </AccessibilityProvider>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
