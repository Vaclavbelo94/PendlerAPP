
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/useAuth'
import { ThemeProvider } from '@/hooks/useTheme'
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider'
import { AdSenseProvider } from '@/components/ads/AdSenseProvider'
import { GDPRConsentProvider } from '@/contexts/GDPRConsentContext'
import { CookieConsentBanner } from '@/components/gdpr/CookieConsentBanner'
import LayoutWrapper from '@/components/layouts/LayoutWrapper'
import { RouteOptimizer } from '@/components/optimized/RouteOptimizer'
import { DatabaseOptimizer } from '@/components/optimized/DatabaseOptimizer'
import { StateManagerProvider } from '@/contexts/StateManagerContext'
import ScrollToTop from '@/components/navigation/ScrollToTop'
import Index from '@/pages/Index'
import Dashboard from '@/pages/Dashboard'
import Vocabulary from '@/pages/Vocabulary'
import Shifts from '@/pages/Shifts'
import Calculator from '@/pages/Calculator'
import Translator from '@/pages/Translator'
import Vehicle from '@/pages/Vehicle'
import TaxAdvisor from '@/pages/TaxAdvisor'
import TravelPlanning from '@/pages/TravelPlanning'
import Laws from '@/pages/Laws'
import Settings from '@/pages/Settings'
import Profile from '@/pages/Profile'
import Premium from '@/pages/Premium'
import Contact from '@/pages/Contact'
import FAQ from '@/pages/FAQ'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Admin from '@/pages/Admin'
import Privacy from '@/pages/Privacy'
import Cookies from '@/pages/Cookies'
import Terms from '@/pages/Terms'

// Law pages imports
import ChildBenefits from '@/pages/laws/ChildBenefits'
import EmployeeProtection from '@/pages/laws/EmployeeProtection'
import HealthInsurance from '@/pages/laws/HealthInsurance'
import LegalAid from '@/pages/laws/LegalAid'
import MinimumHolidays from '@/pages/laws/MinimumHolidays'
import MinimumWage from '@/pages/laws/MinimumWage'
import ParentalAllowance from '@/pages/laws/ParentalAllowance'
import PensionInsurance from '@/pages/laws/PensionInsurance'
import TaxClasses from '@/pages/laws/TaxClasses'
import TaxReturn from '@/pages/laws/TaxReturn'
import WorkContract from '@/pages/laws/WorkContract'
import WorkingHours from '@/pages/laws/WorkingHours'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Router>
            <ScrollToTop />
            <AuthProvider>
              <StateManagerProvider>
                <GDPRConsentProvider>
                  <AnalyticsProvider>
                    <AdSenseProvider clientId="ca-pub-5766122497657850">
                      <DatabaseOptimizer />
                      <RouteOptimizer>
                        <LayoutWrapper>
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/vocabulary" element={<Vocabulary />} />
                            <Route path="/shifts" element={<Shifts />} />
                            <Route path="/calculator" element={<Calculator />} />
                            <Route path="/translator" element={<Translator />} />
                            <Route path="/vehicle" element={<Vehicle />} />
                            <Route path="/tax-advisor" element={<TaxAdvisor />} />
                            <Route path="/travel" element={<TravelPlanning />} />
                            <Route path="/laws" element={<Laws />} />
                            
                            {/* Law detail pages */}
                            <Route path="/laws/child-benefits" element={<ChildBenefits />} />
                            <Route path="/laws/employee-protection" element={<EmployeeProtection />} />
                            <Route path="/laws/health-insurance" element={<HealthInsurance />} />
                            <Route path="/laws/legal-aid" element={<LegalAid />} />
                            <Route path="/laws/minimum-holidays" element={<MinimumHolidays />} />
                            <Route path="/laws/minimum-wage" element={<MinimumWage />} />
                            <Route path="/laws/parental-allowance" element={<ParentalAllowance />} />
                            <Route path="/laws/pension-insurance" element={<PensionInsurance />} />
                            <Route path="/laws/tax-classes" element={<TaxClasses />} />
                            <Route path="/laws/tax-return" element={<TaxReturn />} />
                            <Route path="/laws/work-contract" element={<WorkContract />} />
                            <Route path="/laws/working-hours" element={<WorkingHours />} />
                            
                            {/* Legal pages */}
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/cookies" element={<Cookies />} />
                            <Route path="/terms" element={<Terms />} />
                            
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/premium" element={<Premium />} />
                            {/* Redirect from old pricing page to premium */}
                            <Route path="/pricing" element={<Navigate to="/premium" replace />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/admin" element={<Admin />} />
                          </Routes>
                        </LayoutWrapper>
                      </RouteOptimizer>
                      
                      {/* GDPR Cookie Consent Banner */}
                      <CookieConsentBanner />
                    </AdSenseProvider>
                    <Toaster />
                    <Sonner 
                      position="bottom-right"
                      toastOptions={{
                        duration: 2500,
                        style: {
                          background: 'hsl(var(--background))',
                          color: 'hsl(var(--foreground))',
                          border: '1px solid hsl(var(--border))',
                        },
                      }}
                    />
                  </AnalyticsProvider>
                </GDPRConsentProvider>
              </StateManagerProvider>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
