
import { ReactNode, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile, useOrientation } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
  navbarRightContent?: ReactNode;
}

const Layout = ({ children, navbarRightContent }: LayoutProps) => {
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  
  // Debug logging for layout issues
  useEffect(() => {
    console.log('Layout: State change', { 
      isMobile, 
      orientation, 
      sidebarOpen, 
      pathname: location.pathname 
    });
  }, [isMobile, orientation, sidebarOpen, location.pathname]);
  
  // Zavřít sidebar při změně cesty
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  
  const MobilePortraitLayout = () => (
    <div className="flex min-h-screen bg-background relative w-full">
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-0 z-50">
              <Sidebar 
                closeSidebar={() => setSidebarOpen(false)} 
                mobileVariant="compact"
              />
            </div>
          </>
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="sticky top-0 z-30">
          <Navbar 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            rightContent={navbarRightContent}
            sidebarOpen={sidebarOpen}
          />
        </div>
        
        <div className="flex-1">
          <main className="min-h-[calc(100vh-4rem)]">
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
            className="h-[70vh] w-full p-0 bg-background border-b z-45"
          >
            <Sidebar 
              closeSidebar={() => setSidebarOpen(false)} 
              isLandscapeSheet={true}
              mobileVariant="full"
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

  const DesktopLayout = () => (
    <div className="flex min-h-screen bg-background w-full">
      {/* Modern Sidebar - fixed positioning */}
      <div className="fixed top-0 left-0 h-full z-40">
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content area with dynamic left margin */}
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
  
  // Podmíněné renderování s optimalizací
  if (isMobile) {
    return orientation === "landscape" ? <MobileLandscapeLayout /> : <MobilePortraitLayout />;
  }
  
  return <DesktopLayout />;
};

export default Layout;
