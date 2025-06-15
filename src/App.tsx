import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { AdSenseProvider } from './components/ads/AdSenseContext';
import { AdProvider } from './components/ads/AdContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Vocabulary from './pages/Vocabulary';
import Translator from './pages/Translator';
import Travel from './pages/Travel';
import TaxAdvisor from './pages/TaxAdvisor';
import Shifts from './pages/Shifts';
import Vehicle from './pages/Vehicle';
import Laws from './pages/Laws';
import Settings from './pages/Settings';
import Premium from './pages/Premium';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import Maintenance from './pages/Maintenance';
import AccessibilityStatement from './pages/AccessibilityStatement';
import CookiePolicy from './pages/CookiePolicy';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { AccessibilityProvider } from './components/accessibility/AccessibilityContext';
import CookieConsentBanner from './components/common/CookieConsentBanner';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import GlobalScrollToTop from './components/common/GlobalScrollToTop';
import { ThemeProvider } from "@/hooks/useTheme";

function App() {
  // Simulate maintenance mode
  const maintenanceMode = false;

  // Function to handle errors within the ErrorBoundary
  const handleError = (error: Error, componentStack: string) => {
    console.error('Error caught by ErrorBoundary:', error, componentStack);
    // Here you might want to log the error to a service like Sentry or Firebase Crashlytics
  };

  return (
    <ThemeProvider>
      <QueryClient>
        <AdSenseProvider>
          <AdProvider>
            <Router>
              <div className="min-h-screen bg-background text-foreground">
                <ErrorBoundary onError={handleError} fallback={<div>Došlo k chybě. Zkuste to prosím znovu.</div>}>
                  <Toaster position="top-right" />
                  <AccessibilityProvider>
                    <CookieConsentBanner />
                    <PWAInstallPrompt />
                    
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/vocabulary" element={<Vocabulary />} />
                      <Route path="/translator" element={<Translator />} />
                      <Route path="/travel" element={<Travel />} />
                      <Route path="/tax-advisor" element={<TaxAdvisor />} />
                      <Route path="/shifts" element={<Shifts />} />
                      <Route path="/vehicle" element={<Vehicle />} />
                      <Route path="/laws" element={<Laws />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/premium" element={<Premium />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/faq" element={<FAQ />} />
                      
                      {/* Admin route - accessible only to admins */}
                      <Route path="/admin" element={<Admin />} />
                      
                      {/* Authentication routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      
                      {/* Static content routes */}
                      <Route path="/accessibility-statement" element={<AccessibilityStatement />} />
                      <Route path="/cookie-policy" element={<CookiePolicy />} />
                      <Route path="/terms-of-service" element={<TermsOfService />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      
                      {/* Maintenance mode route */}
                      {maintenanceMode && <Route path="*" element={<Maintenance />} />}
                      
                      {/* Not Found route - catch-all for non-existing routes */}
                      {!maintenanceMode && <Route path="*" element={<NotFound />} />}
                    </Routes>
                    
                    <GlobalScrollToTop />
                  </AccessibilityProvider>
                </ErrorBoundary>
              </div>
            </Router>
          </AdProvider>
        </AdSenseProvider>
      </QueryClient>
    </ThemeProvider>
  );
}

export default App;
