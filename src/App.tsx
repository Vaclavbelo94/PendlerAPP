
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/hooks/useTheme"
import { AuthProvider } from '@/hooks/auth';
import LayoutWrapper from '@/components/layouts/LayoutWrapper';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import TaxAdvisor from './pages/TaxAdvisor';
import Settings from './pages/Settings';
import Vehicle from './pages/Vehicle';
import Shifts from './pages/Shifts';
import Vocabulary from './pages/Vocabulary';
import Laws from './pages/Laws';
import AdminPanel from './pages/AdminPanel';
import Admin from './pages/Admin';
import Premium from './pages/Premium';
import Profile from './pages/Profile';
import TravelPlanning from './pages/TravelPlanning';
import Login from './pages/Login';
import Register from './pages/Register';
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
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/tax-advisor" element={<TaxAdvisor />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/vehicle" element={<Vehicle />} />
                <Route path="/shifts" element={<Shifts />} />
                <Route path="/vocabulary" element={<Vocabulary />} />
                <Route path="/translator" element={<Translator />} />
                <Route path="/laws" element={<Laws />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/premium" element={<Premium />} />
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
