
import { ReactNode, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UnifiedMobileSidebar } from "./sidebar/UnifiedMobileSidebar";

interface SimplifiedMobileLayoutProps {
  children: ReactNode;
  navbarRightContent?: ReactNode;
}

const SimplifiedMobileLayout = ({ children, navbarRightContent }: SimplifiedMobileLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const { user } = useAuth();
  
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
  
  if (isMobile) {
    return (
      <div className="flex min-h-screen bg-background">
        <UnifiedMobileSidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          variant="overlay"
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className="sticky top-0 z-30 mobile-safe-area">
            <Navbar 
              toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
              rightContent={navbarRightContent}
              sidebarOpen={sidebarOpen}
            />
          </div>
          
          <main className="flex-1 mobile-content-wrapper">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    );
  }
  
  // Desktop layout - compact and simple
  return (
    <div className="flex min-h-screen bg-background">
      <div className="fixed top-0 left-0 h-full z-40">
        <UnifiedMobileSidebar
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

export default SimplifiedMobileLayout;
