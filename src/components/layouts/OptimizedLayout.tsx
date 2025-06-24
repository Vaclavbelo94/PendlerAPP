
import { ReactNode, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UnifiedMobileSidebar } from "./sidebar/UnifiedMobileSidebar";
import { useTranslation } from "react-i18next";

interface OptimizedLayoutProps {
  children: ReactNode;
  navbarRightContent?: ReactNode;
}

const OptimizedLayout = ({ children, navbarRightContent }: OptimizedLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const { user } = useAuth();
  const { i18n } = useTranslation();
  
  // Simplified responsive detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  
  // Force sidebar re-render when language changes
  const [sidebarKey, setSidebarKey] = useState(0);
  useEffect(() => {
    setSidebarKey(prev => prev + 1);
  }, [i18n.language]);
  
  if (isMobile) {
    return (
      <div className="flex min-h-screen bg-background">
        <UnifiedMobileSidebar
          key={`mobile-${sidebarKey}`}
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          variant="overlay"
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className="sticky top-0 z-30">
            <Navbar 
              toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
              rightContent={navbarRightContent}
              sidebarOpen={sidebarOpen}
            />
          </div>
          
          <main className="flex-1 px-4 py-4">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    );
  }
  
  // Desktop layout
  return (
    <div className="flex min-h-screen bg-background">
      <div className="fixed top-0 left-0 h-full z-40">
        <UnifiedMobileSidebar
          key={`desktop-${sidebarKey}`}
          isOpen={true}
          closeSidebar={() => {}}
          variant="compact"
        />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 ml-20">
        <ScrollArea className="flex-1">
          <main className="flex-1 px-4 py-4 min-h-screen">
            {children}
          </main>
          <Footer />
        </ScrollArea>
      </div>
    </div>
  );
};

export default OptimizedLayout;
