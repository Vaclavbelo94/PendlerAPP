import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient } from 'react-query';
import { Toaster } from "@/components/ui/toaster"

import Layout from '@/components/layouts/Layout';
import Home from '@/pages/Home';
import Calculator from '@/pages/Calculator';
import TaxAdvisor from '@/pages/TaxAdvisor';
import Vehicle from '@/pages/Vehicle';
import Vocabulary from '@/pages/Vocabulary';
import Translator from '@/pages/Translator';
import Laws from '@/pages/Laws';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import Dashboard from '@/pages/Dashboard';
import Shifts from '@/pages/Shifts';
import TravelPlanning from '@/pages/TravelPlanning';
import Language from '@/pages/Language';
import NotFound from '@/pages/NotFound';

import { AuthProvider } from '@/hooks/useAuth';
import { NotificationManager } from '@/components/notifications/NotificationManager';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <Toaster />
            <Layout>
              <NotificationManager />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/tax-advisor" element={<TaxAdvisor />} />
                <Route path="/vehicle" element={<Vehicle />} />
                <Route path="/vocabulary" element={<Vocabulary />} />
                <Route path="/translator" element={<Translator />} />
                <Route path="/laws" element={<Laws />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/shifts" element={<Shifts />} />
                <Route path="/travel-planning" element={<TravelPlanning />} />
                <Route path="/language" element={<Language />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
