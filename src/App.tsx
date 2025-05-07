
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Language from "./pages/Language";
import Laws from "./pages/Laws";
import Vehicle from "./pages/Vehicle";
import Shifts from "./pages/Shifts";
import TranslatorPage from "./pages/Translator";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Layout from "./components/layouts/Layout";

// Law detail pages
import MinimumWage from "./pages/laws/MinimumWage";
import TaxClasses from "./pages/laws/TaxClasses";
import HealthInsurance from "./pages/laws/HealthInsurance";
import WorkContract from "./pages/laws/WorkContract";
import TaxReturn from "./pages/laws/TaxReturn";
import PensionInsurance from "./pages/laws/PensionInsurance";
import EmployeeProtection from "./pages/laws/EmployeeProtection";
import ChildBenefits from "./pages/laws/ChildBenefits";

import "./index.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" closeButton />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/language" element={<Layout><Language /></Layout>} />
          <Route path="/laws" element={<Layout><Laws /></Layout>} />
          <Route path="/vehicle" element={<Layout><Vehicle /></Layout>} />
          <Route path="/shifts" element={<Layout><Shifts /></Layout>} />
          <Route path="/translator" element={<Layout><TranslatorPage /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/faq" element={<Layout><FAQ /></Layout>} />
          <Route path="/terms" element={<Layout><Terms /></Layout>} />
          <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
          <Route path="/cookies" element={<Layout><Cookies /></Layout>} />
          
          {/* Law detail pages */}
          <Route path="/laws/minimum-wage" element={<Layout><MinimumWage /></Layout>} />
          <Route path="/laws/tax-classes" element={<Layout><TaxClasses /></Layout>} />
          <Route path="/laws/health-insurance" element={<Layout><HealthInsurance /></Layout>} />
          <Route path="/laws/work-contract" element={<Layout><WorkContract /></Layout>} />
          <Route path="/laws/tax-return" element={<Layout><TaxReturn /></Layout>} />
          <Route path="/laws/pension-insurance" element={<Layout><PensionInsurance /></Layout>} />
          <Route path="/laws/employee-protection" element={<Layout><EmployeeProtection /></Layout>} />
          <Route path="/laws/child-benefits" element={<Layout><ChildBenefits /></Layout>} />
          
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
