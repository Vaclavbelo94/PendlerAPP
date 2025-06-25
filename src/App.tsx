import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/hooks/auth';
import { StandardizedToast } from '@/components/ui/standardized-toast';
import Dashboard from '@/pages/Dashboard';
import Shifts from '@/pages/Shifts';
import Travel from '@/pages/Travel';
import TaxAdvisor from '@/pages/TaxAdvisor';
import Language from '@/pages/Language';
import Translator from '@/pages/Translator';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Logout from '@/pages/Logout';
import Register from '@/pages/Register';
import Admin from '@/pages/Admin';
import Premium from '@/pages/Premium';
import PremiumCallback from '@/pages/PremiumCallback';
import PremiumCancel from '@/pages/PremiumCancel';
import PremiumSuccess from '@/pages/PremiumSuccess';
import NotFound from '@/pages/NotFound';
import PasswordReset from '@/pages/PasswordReset';
import PasswordUpdate from '@/pages/PasswordUpdate';
import TermsAndConditions from '@/pages/TermsAndConditions';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import GDPR from '@/pages/GDPR';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import DHLDashboard from '@/pages/DHLDashboard';
import DHLAdmin from '@/pages/DHLAdmin';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <NotFound />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/shifts",
    element: <Shifts />,
  },
  {
    path: "/travel",
    element: <Travel />,
  },
  {
    path: "/tax-advisor",
    element: <TaxAdvisor />,
  },
  {
    path: "/language",
    element: <Language />,
  },
  {
    path: "/translator",
    element: <Translator />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/premium",
    element: <Premium />,
  },
  {
    path: "/premium/callback",
    element: <PremiumCallback />,
  },
  {
    path: "/premium/cancel",
    element: <PremiumCancel />,
  },
  {
    path: "/premium/success",
    element: <PremiumSuccess />,
  },
  {
    path: "/password-reset",
    element: <PasswordReset />,
  },
  {
    path: "/password-update",
    element: <PasswordUpdate />,
  },
  {
    path: "/terms-and-conditions",
    element: <TermsAndConditions />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/gdpr",
    element: <GDPR />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:id",
    element: <BlogPost />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/dhl-dashboard",
    element: <DHLDashboard />,
  },
  {
    path: "/dhl-admin",
    element: <DHLAdmin />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <StandardizedToast />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
