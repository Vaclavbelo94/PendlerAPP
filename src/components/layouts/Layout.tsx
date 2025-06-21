
import { ReactNode, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AnimatePresence } from "framer-motion";
import { useUnifiedOrientation } from "@/hooks/useUnifiedOrientation";
import { UnifiedMobileSidebar } from "./sidebar/UnifiedMobileSidebar";
import { ModernSidebar } from "./sidebar/ModernSidebar";
import { useLanguage } from "@/hooks/useLanguage";

interface LayoutProps {
  children: ReactNode;
  navbarRightContent?: ReactNode;
}

const Layout = ({ children, navbarRightContent }: LayoutProps) => {
  const { isMobile, isTablet, orientation, isSmallLandscape } = useUnifiedOrientation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  
  // Debug logging
  useEffect(() => {
    console.log('Layout: Unified orientation state', { 
      isMobile, 
      isTablet, 
      orientation, 
      isSmallLandscape,
      sidebarOpen, 
      pathname: location.pathname 
    });
  }, [isMobile, isTablet, orientation, isSmallLandscape, sidebarOpen, location.pathname]);
  
  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  
  const MobilePortraitLayout = () => (
    <div className="flex min-h-screen bg-background relative w-full">
      <UnifiedMobileSidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        variant="overlay"
      />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="sticky top-0 z-30">
          <Navbar 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            rightContent={navbarRightContent}
            sidebarOpen={sidebarOpen}
          />
        </div>
        
        <div className="flex-1">
          <main className="mobile-content-wrapper">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );

  const MobileLandscapeLayout = () => (
    <div className="flex min-h-screen bg-background w-full">
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          rightContent={navbarRightContent}
          sidebarOpen={sidebarOpen}
        />
        
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent 
            side="top" 
            className="h-[70vh] w-full p-0 bg-background border-b z-[110]"
          >
            <UnifiedMobileSidebar
              isOpen={sidebarOpen}
              closeSidebar={() => setSidebarOpen(false)}
              variant="sheet"
            />
          </SheetContent>
        </Sheet>
        
        <ScrollArea className="flex-1">
          <main className="flex-1 px-3 py-2">
            {children}
          </main>
          <Footer />
        </ScrollArea>
      </div>
    </div>
  );

  const TabletLayout = () => (
    <div className="flex min-h-screen bg-background w-full">
      <UnifiedMobileSidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        variant="compact"
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-30">
          <Navbar 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            rightContent={navbarRightContent}
            sidebarOpen={sidebarOpen}
          />
        </div>
        
        <ScrollArea className="flex-1">
          <main className="flex-1 px-4 py-4">
            {children}
          </main>
          <Footer />
        </ScrollArea>
      </div>
    </div>
  );

  const DesktopLayout = () => (
    <div className="flex min-h-screen bg-background w-full">
      {/* Desktop Sidebar */}
      <div className="fixed top-0 left-0 h-full z-40">
        <ModernSidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 ml-20 transition-all duration-300">
        <ScrollArea className="flex-1">
          <main className="flex-1 px-4 py-4 min-h-screen">
            {children}
          </main>
          <Footer />
        </ScrollArea>
      </div>
    </div>
  );
  
  // Conditional rendering based on device type
  if (isMobile) {
    return orientation === "landscape" && isSmallLandscape 
      ? <MobileLandscapeLayout /> 
      : <MobilePortraitLayout />;
  }
  
  if (isTablet) {
    return <TabletLayout />;
  }
  
  return <DesktopLayout />;
};

export default Layout;
