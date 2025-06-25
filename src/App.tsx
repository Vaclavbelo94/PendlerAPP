
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/auth";
import { OptimizedProviderStack } from "@/components/providers/OptimizedProviderStack";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import DHLAdmin from "./pages/DHLAdmin";
import Premium from "./pages/Premium";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import DHLSetupPage from "@/pages/DHLSetup";
import DHLDashboardPage from "@/pages/DHLDashboard";
import Shifts from "./pages/Shifts";
import Travel from "./pages/Travel";
import Vehicle from "./pages/Vehicle";
import Translator from "./pages/Translator";
import TaxAdvisor from "./pages/TaxAdvisor";
import Laws from "./pages/Laws";
import Layout from "./components/layouts/Layout";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <AuthProvider>
          <OptimizedProviderStack>
            <Routes>
              {/* Public routes with Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="pricing" element={<Pricing />} />
              </Route>

              {/* Auth routes without Layout */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes with Layout */}
              <Route path="/dashboard" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="premium" element={<Premium />} />
              </Route>

              {/* Main feature routes with Layout */}
              <Route path="/profile" element={<Layout />}>
                <Route index element={<Profile />} />
              </Route>

              <Route path="/settings" element={<Layout />}>
                <Route index element={<Settings />} />
              </Route>

              <Route path="/shifts" element={<Layout />}>
                <Route index element={<Shifts />} />
              </Route>

              <Route path="/travel" element={<Layout />}>
                <Route index element={<Travel />} />
              </Route>

              <Route path="/vehicle" element={<Layout />}>
                <Route index element={<Vehicle />} />
              </Route>

              <Route path="/translator" element={<Layout />}>
                <Route index element={<Translator />} />
              </Route>

              <Route path="/tax-advisor" element={<Layout />}>
                <Route index element={<TaxAdvisor />} />
              </Route>

              <Route path="/laws" element={<Layout />}>
                <Route index element={<Laws />} />
              </Route>

              {/* Admin routes with Layout */}
              <Route path="/admin" element={<Layout />}>
                <Route index element={<Admin />} />
              </Route>

              {/* DHL Admin routes with Layout - POUZE pro admin_dhl@pendlerapp.com */}
              <Route path="/dhl-admin" element={<Layout />}>
                <Route index element={<DHLAdmin />} />
              </Route>

              {/* Specialized DHL routes */}
              <Route path="/dhl-setup" element={<DHLSetupPage />} />
              <Route path="/dhl-dashboard" element={<Layout />}>
                <Route index element={<DHLDashboardPage />} />
              </Route>

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </OptimizedProviderStack>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
