
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/useAuth'
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider'
import LayoutWrapper from '@/components/layouts/LayoutWrapper'
import { RouteOptimizer } from '@/components/optimized/RouteOptimizer'
import { DatabaseOptimizer } from '@/components/optimized/DatabaseOptimizer'
import { StateManagerProvider } from '@/contexts/StateManagerContext'
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
import Pricing from '@/pages/Pricing'
import Contact from '@/pages/Contact'
import FAQ from '@/pages/FAQ'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Admin from '@/pages/Admin'

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
        <Router>
          <AuthProvider>
            <StateManagerProvider>
              <AnalyticsProvider>
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
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/premium" element={<Premium />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/admin" element={<Admin />} />
                    </Routes>
                  </LayoutWrapper>
                </RouteOptimizer>
                <Toaster />
                <Sonner />
              </AnalyticsProvider>
            </StateManagerProvider>
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
