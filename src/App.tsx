
import { Helmet } from "react-helmet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UnifiedAuthProvider } from "@/contexts/UnifiedAuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthDebugPanel from "@/components/debug/AuthDebugPanel";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import SimpleLoadingSpinner from "@/components/loading/SimpleLoadingSpinner";
import "./i18n/config";
import "./App.css";

// Lazy load pages for better performance
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));
const Premium = lazy(() => import("@/pages/Premium"));
const Shifts = lazy(() => import("@/pages/Shifts"));
const Vehicle = lazy(() => import("@/pages/Vehicle"));
const Travel = lazy(() => import("@/pages/Travel"));
const Laws = lazy(() => import("@/pages/Laws"));
const Translator = lazy(() => import("@/pages/Translator"));
const TaxAdvisor = lazy(() => import("@/pages/TaxAdvisor"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Admin = lazy(() => import("@/pages/Admin"));
const DHLAdmin = lazy(() => import("@/pages/DHLAdmin"));
const DHLSetup = lazy(() => import("@/pages/DHLSetup"));
const Setup = lazy(() => import("@/pages/Setup"));
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Features = lazy(() => import("@/pages/Features"));
const Pricing = lazy(() => import("@/pages/Pricing"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

// Fallback pages for missing components
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground">This page is under development</p>
    </div>
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<SimpleLoadingSpinner />}>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      
      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth" element={<Navigate to="/login" replace />} />
      
      {/* Protected Routes with Layout */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile-extended" element={<Navigate to="/profile" replace />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* Premium Features */}
      <Route path="/premium" element={<Premium />} />
      <Route path="/shifts" element={<Shifts />} />
      <Route path="/vehicle" element={<Vehicle />} />
      <Route path="/travel" element={<Travel />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/tax-advisor" element={<TaxAdvisor />} />
      
      {/* Public Tools */}
      <Route path="/translator" element={<Translator />} />
      <Route path="/laws" element={<Laws />} />
      
      {/* DHL Routes */}
      <Route path="/dhl-setup" element={<DHLSetup />} />
      <Route path="/dhl-admin" element={<DHLAdmin />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<Admin />} />
      
      {/* Setup Route */}
      <Route path="/setup" element={<Setup />} />
      
      {/* Fallback Routes */}
      <Route path="/unauthorized" element={<PlaceholderPage title="Unauthorized Access" />} />
      <Route path="/suspended" element={<PlaceholderPage title="Account Suspended" />} />
      
      {/* Catch-all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

function App() {
  return (
    <ErrorBoundary>
      <Helmet>
        <title>PendlerApp - Comprehensive Solution for Czech Workers in Germany</title>
        <meta name="description" content="Complete platform for managing work shifts, calculating taxes, and finding transport solutions for Czech workers in Germany." />
      </Helmet>
      
      <QueryClientProvider client={queryClient}>
        <Router>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <TooltipProvider>
              <UnifiedAuthProvider>
                <LayoutWrapper>
                  <AppRoutes />
                </LayoutWrapper>
                <AuthDebugPanel />
                
                <Toaster />
                <Sonner 
                  position="bottom-right"
                  toastOptions={{
                    duration: 2500,
                    style: {
                      background: 'hsl(var(--background))',
                      color: 'hsl(var(--foreground))',
                      border: '1px solid hsl(var(--border))',
                    },
                  }}
                />
              </UnifiedAuthProvider>
            </TooltipProvider>
          </ThemeProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
