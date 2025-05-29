
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorBoundaryWithFallback';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import Premium from "@/pages/Premium";
import PremiumSuccess from "@/pages/PremiumSuccess";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <AccessibilityProvider>
            <ErrorBoundaryWithFallback>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/premium/success" element={<PremiumSuccess />} />
              </Routes>
            </ErrorBoundaryWithFallback>
          </AccessibilityProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
