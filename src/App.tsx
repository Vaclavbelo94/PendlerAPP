import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/auth";
import { QueryProvider } from "@/components/providers/OptimizedProviderStack";
import { OptimizedProviderStack } from "@/components/providers/OptimizedProviderStack";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Premium from "./pages/Premium";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";
import PasswordReset from "./pages/PasswordReset";
import PasswordUpdate from "./pages/PasswordUpdate";
import VerifyEmail from "./pages/VerifyEmail";
import Impressum from "./pages/Impressum";
import DataPrivacy from "./pages/DataPrivacy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import AdminLayout from "./layouts/AdminLayout";
import DHLSetupPage from "@/pages/DHLSetup";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <AuthProvider>
          <QueryProvider>
            <OptimizedProviderStack>
              <Routes>
                <Route path="/" element={<PublicLayout />} >
                  <Route index element={<About />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="pricing" element={<Pricing />} />
                  <Route path="password-reset" element={<PasswordReset />} />
                  <Route path="password-update" element={<PasswordUpdate />} />
                  <Route path="verify-email" element={<VerifyEmail />} />
                  <Route path="impressum" element={<Impressum />} />
                  <Route path="data-privacy" element={<DataPrivacy />} />
                  <Route path="terms-of-service" element={<TermsOfService />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="/dashboard" element={<AppLayout />} >
                  <Route index element={<Dashboard />} />
                  <Route path="premium" element={<Premium />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="logout" element={<Logout />} />
                </Route>

                <Route path="/admin" element={<AdminLayout />} >
                  <Route index element={<Admin />} />
                </Route>
                <Route path="/dhl-setup" element={<DHLSetupPage />} />
              </Routes>
            </OptimizedProviderStack>
          </QueryProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
