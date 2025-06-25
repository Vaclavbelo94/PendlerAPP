
import { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/auth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Shifts from "./pages/Shifts";
import TravelPlanning from "./pages/TravelPlanning";
import Translator from "./pages/Translator";
import TaxAdvisor from "./pages/TaxAdvisor";
import Laws from "./pages/Laws";
import LawDetail from "./pages/LawDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Vehicle from "./pages/Vehicle";
import Premium from "./pages/Premium";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import "./i18n/config";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/shifts" element={<Shifts />} />
                  <Route path="/travel" element={<TravelPlanning />} />
                  <Route path="/translator" element={<Translator />} />
                  <Route path="/tax-advisor" element={<TaxAdvisor />} />
                  <Route path="/laws" element={<Laws />} />
                  <Route path="/laws/:lawId" element={<LawDetail />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/vehicle" element={<Vehicle />} />
                  <Route path="/premium" element={<Premium />} />
                </Routes>
              </Suspense>
              <Toaster />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
