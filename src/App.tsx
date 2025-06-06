
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import UnifiedProfile from "./pages/UnifiedProfile";
import ProfileExtended from "./pages/ProfileExtended";
import LanguageManager from "./components/language/LanguageManager";
import Layout from "./components/layouts/Layout";

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageManager>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<UnifiedProfile />} />
                <Route path="/profile-extended" element={<ProfileExtended />} />
                <Route path="/profile-extended/:userId" element={<ProfileExtended />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </LanguageManager>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
