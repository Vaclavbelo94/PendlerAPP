import { Helmet } from "react-helmet";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UnifiedAuthProvider } from "@/contexts/UnifiedAuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthDebugPanel from "@/components/debug/AuthDebugPanel";
import "./i18n/config";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

// Simple routing placeholder - replace with your actual routes
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<div>Home Page - Please configure your routes</div>} />
    <Route path="/auth" element={<div>Auth Page - Please configure your routes</div>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
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
                <AppRoutes />
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
