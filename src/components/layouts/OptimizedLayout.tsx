
import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { performanceTracker } from "@/utils/performanceOptimizer";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UnifiedMobileSidebar } from "./sidebar/UnifiedMobileSidebar";

interface OptimizedLayoutProps {
  children: ReactNode;
  navbarRightContent?: ReactNode;
}

const OptimizedLayout = ({ children, navbarRightContent }: OptimizedLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const { user } = useAuth();
  
  // Add performance monitoring
  usePerformanceMonitoring({
    enableRealTimeTracking: true,
    trackUserInteractions: true,
    trackMemoryUsage: true,
    reportingInterval: 60000 // 1 minuta
  });

  // Track route changes
  useEffect(() => {
    const routeName = location.pathname;
    const tracker = performanceTracker.trackPageLoad(routeName);
    
    // Mark route as ready after render
    const timer = setTimeout(() => {
      tracker.finish();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);
  
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
