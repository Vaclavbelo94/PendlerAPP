
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/hooks/useTheme"
import { AuthProvider } from '@/hooks/auth';
import LayoutWrapper from '@/components/layouts/LayoutWrapper';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import TaxAdvisor from './pages/TaxAdvisor';
import Settings from './pages/Settings';
import Vehicle from './pages/Vehicle';
import Shifts from './pages/Shifts';
import Vocabulary from './pages/Vocabulary';
import AdminPanel from './pages/AdminPanel';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import TravelPlanning from './pages/TravelPlanning';
import { ShiftNotifications } from "@/components/notifications/ShiftNotifications";
import Translator from './pages/Translator';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Toaster />
          <BrowserRouter>
            <LayoutWrapper>
              <ShiftNotifications />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/tax-advisor" element={<TaxAdvisor />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/vehicle" element={<Vehicle />} />
                <Route path="/shifts" element={<Shifts />} />
                <Route path="/vocabulary" element={<Vocabulary />} />
                <Route path="/translator" element={<Translator />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/travel-planning" element={<TravelPlanning />} />
              </Routes>
            </LayoutWrapper>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
