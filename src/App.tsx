
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/hooks/useTheme"
import { AuthProvider } from '@/hooks/auth';
import LayoutWrapper from '@/components/layouts/LayoutWrapper';
import ScrollToTop from '@/components/navigation/ScrollToTop';
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
import NotFound from './pages/NotFound';
import { ShiftNotifications } from "@/components/notifications/ShiftNotifications";
import Translator from './pages/Translator';

// Import law detail pages
import MinimumWage from './pages/laws/MinimumWage';
import TaxClasses from './pages/laws/TaxClasses';
import HealthInsurance from './pages/laws/HealthInsurance';
import WorkContract from './pages/laws/WorkContract';
import TaxReturn from './pages/laws/TaxReturn';
import PensionInsurance from './pages/laws/PensionInsurance';
import EmployeeProtection from './pages/laws/EmployeeProtection';
import ChildBenefits from './pages/laws/ChildBenefits';
import WorkingHours from './pages/laws/WorkingHours';
import MinimumHolidays from './pages/laws/MinimumHolidays';
import ParentalAllowance from './pages/laws/ParentalAllowance';
import LegalAid from './pages/laws/LegalAid';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Toaster />
          <BrowserRouter>
            <ScrollToTop />
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
                
                {/* Law detail pages */}
                <Route path="/laws/minimum-wage" element={<MinimumWage />} />
                <Route path="/laws/tax-classes" element={<TaxClasses />} />
                <Route path="/laws/health-insurance" element={<HealthInsurance />} />
                <Route path="/laws/work-contract" element={<WorkContract />} />
                <Route path="/laws/tax-return" element={<TaxReturn />} />
                <Route path="/laws/pension-insurance" element={<PensionInsurance />} />
                <Route path="/laws/employee-protection" element={<EmployeeProtection />} />
                <Route path="/laws/child-benefits" element={<ChildBenefits />} />
                <Route path="/laws/working-hours" element={<WorkingHours />} />
                <Route path="/laws/minimum-holidays" element={<MinimumHolidays />} />
                <Route path="/laws/parental-allowance" element={<ParentalAllowance />} />
                <Route path="/laws/legal-aid" element={<LegalAid />} />
                
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/travel-planning" element={<TravelPlanning />} />
                
                {/* 404 Route - must be last */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LayoutWrapper>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
