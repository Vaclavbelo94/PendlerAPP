import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

// Import components
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/Dashboard';
import DHLAwareShifts from '@/components/dhl/DHLAwareShifts';
import DHLDashboard from '@/pages/DHLDashboard';
import DHLAdminWithLayout from '@/components/dhl/DHLAdminWithLayout';
import DHLSetup from '@/pages/DHLSetup';
import TaxAdvisor from '@/pages/TaxAdvisor';
import Translator from '@/pages/Translator';
import Vehicle from '@/pages/Vehicle';
import Travel from '@/pages/Travel';
import Laws from '@/pages/Laws';
import Premium from '@/pages/Premium';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import PricingPage from '@/pages/PricingPage';
import ContactPage from '@/pages/ContactPage';
import FAQPage from '@/pages/FAQPage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />

                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected routes with standard layout */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shifts"
                  element={
                    <ProtectedRoute>
                      <DHLAwareShifts />
                    </ProtectedRoute>
                  }
                />
                
                {/* DHL specific routes with DHL layout */}
                <Route
                  path="/dhl-dashboard"
                  element={
                    <ProtectedRoute>
                      <DHLDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dhl-admin"
                  element={
                    <ProtectedRoute>
                      <DHLAdminWithLayout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dhl-setup"
                  element={
                    <ProtectedRoute>
                      <DHLSetup />
                    </ProtectedRoute>
                  }
                />

                {/* Other protected routes */}
                <Route
                  path="/tax-advisor"
                  element={
                    <ProtectedRoute>
                      <TaxAdvisor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/translator"
                  element={
                    <ProtectedRoute>
                      <Translator />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vehicle"
                  element={
                    <ProtectedRoute>
                      <Vehicle />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/travel"
                  element={
                    <ProtectedRoute>
                      <Travel />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/laws"
                  element={
                    <ProtectedRoute>
                      <Laws />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/premium"
                  element={
                    <ProtectedRoute>
                      <Premium />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </I18nextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
