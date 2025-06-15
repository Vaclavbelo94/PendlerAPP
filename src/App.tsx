
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Vocabulary from './pages/Vocabulary';
import Translator from './pages/Translator';
import TaxAdvisor from './pages/TaxAdvisor';
import Shifts from './pages/Shifts';
import Vehicle from './pages/Vehicle';
import Laws from './pages/Laws';
import Settings from './pages/Settings';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import { GlobalScrollToTop } from './components/common/GlobalScrollToTop';
import { ThemeProvider } from "@/hooks/useTheme";

const queryClient = new QueryClient();

function App() {
  // Function to handle errors within the ErrorBoundary
  const handleError = (error: Error, componentStack: string) => {
    console.error('Error caught by ErrorBoundary:', error, componentStack);
    // Here you might want to log the error to a service like Sentry or Firebase Crashlytics
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Toaster position="top-right" />
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/vocabulary" element={<Vocabulary />} />
              <Route path="/translator" element={<Translator />} />
              <Route path="/tax-advisor" element={<TaxAdvisor />} />
              <Route path="/shifts" element={<Shifts />} />
              <Route path="/vehicle" element={<Vehicle />} />
              <Route path="/laws" element={<Laws />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              
              {/* Admin route - accessible only to admins */}
              <Route path="/admin" element={<Admin />} />
              
              {/* Authentication routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Not Found route - catch-all for non-existing routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <GlobalScrollToTop />
          </div>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
