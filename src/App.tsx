
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Layouts
import LayoutWrapper from './components/layouts/LayoutWrapper';

// Auth & Theme Providers
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Admin from './pages/Admin';
import Calculator from './pages/Calculator';
import Contact from './pages/Contact';
import Cookies from './pages/Cookies';
import FAQ from './pages/FAQ';
import Language from './pages/Language';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Premium from './pages/Premium';
import Privacy from './pages/Privacy';
import Profile from './pages/Profile';
import ProfileExtended from './pages/ProfileExtended';
import Register from './pages/Register';
import Shifts from './pages/Shifts';
import Terms from './pages/Terms';
import Translator from './pages/Translator';
import Vehicle from './pages/Vehicle';
import TravelPlanning from './pages/TravelPlanning';
import TaxAdvisor from './pages/TaxAdvisor';

// Stránky o zákonech
import Laws from './pages/Laws';
import ChildBenefits from './pages/laws/ChildBenefits';
import EmployeeProtection from './pages/laws/EmployeeProtection';
import HealthInsurance from './pages/laws/HealthInsurance';
import MinimumHolidays from './pages/laws/MinimumHolidays';
import MinimumWage from './pages/laws/MinimumWage';
import ParentalAllowance from './pages/laws/ParentalAllowance';
import PensionInsurance from './pages/laws/PensionInsurance';
import TaxClasses from './pages/laws/TaxClasses';
import TaxReturn from './pages/laws/TaxReturn';
import WorkContract from './pages/laws/WorkContract';

// Právní asistent - prémiová sekce
import LegalAssistant from './pages/LegalAssistant';
import WorkContractGuide from './pages/legal/WorkContract';
import RentalAgreement from './pages/legal/RentalAgreement';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LayoutWrapper>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/language" element={<Language />} />
              <Route path="/login" element={<Login />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile-extended" element={<ProfileExtended />} />
              <Route path="/profile-extended/:userId" element={<ProfileExtended />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shifts" element={<Shifts />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/translator" element={<Translator />} />
              <Route path="/vehicle" element={<Vehicle />} />
              <Route path="/travel-planning" element={<TravelPlanning />} />
              <Route path="/tax-advisor" element={<TaxAdvisor />} />
              
              {/* Stránky o zákonech */}
              <Route path="/laws" element={<Laws />} />
              <Route path="/laws/child-benefits" element={<ChildBenefits />} />
              <Route path="/laws/employee-protection" element={<EmployeeProtection />} />
              <Route path="/laws/health-insurance" element={<HealthInsurance />} />
              <Route path="/laws/minimum-holidays" element={<MinimumHolidays />} />
              <Route path="/laws/minimum-wage" element={<MinimumWage />} />
              <Route path="/laws/parental-allowance" element={<ParentalAllowance />} />
              <Route path="/laws/pension-insurance" element={<PensionInsurance />} />
              <Route path="/laws/tax-classes" element={<TaxClasses />} />
              <Route path="/laws/tax-return" element={<TaxReturn />} />
              <Route path="/laws/work-contract" element={<WorkContract />} />
              
              {/* Právní asistent - prémiová sekce */}
              <Route path="/legal-assistant" element={<LegalAssistant />} />
              <Route path="/legal/work-contract" element={<WorkContractGuide />} />
              <Route path="/legal/rental-agreement" element={<RentalAgreement />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LayoutWrapper>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
