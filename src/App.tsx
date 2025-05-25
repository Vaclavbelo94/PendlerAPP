import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '@/hooks/auth';
import LayoutWrapper from '@/components/LayoutWrapper';
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
import { ShiftNotifications } from "@/components/notifications/ShiftNotifications";

function App() {
  return (
    <QueryClient>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </LayoutWrapper>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClient>
  );
}

export default App;
