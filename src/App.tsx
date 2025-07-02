
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UnifiedAuthProvider } from "@/contexts/UnifiedAuthContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Shifts from "./pages/Shifts";
import Vehicle from "./pages/Vehicle";
import Travel from "./pages/Travel";
import Calculator from "./pages/Calculator";
import TaxAdvisor from "./pages/TaxAdvisor";
import Analytics from "./pages/Analytics";
import Laws from "./pages/Laws";
import DHLSetup from "./pages/DHLSetup";
import Admin from "./pages/Admin";
import Premium from "./pages/Premium";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Features from "./pages/Features";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <UnifiedAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/shifts" element={<Shifts />} />
                <Route path="/vehicle" element={<Vehicle />} />
                <Route path="/travel" element={<Travel />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/tax-advisor" element={<TaxAdvisor />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/laws" element={<Laws />} />
                <Route path="/dhl-setup" element={<DHLSetup />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/features" element={<Features />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </UnifiedAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
