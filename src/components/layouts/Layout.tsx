
import { ReactNode, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile, useOrientation } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

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
  
  // Zavřít sidebar při změně cesty
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  
  // Memoized layout components pro lepší výkon
  const MobilePortraitLayout = () => (
    <div className="flex min-h-screen bg-background relative">
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[60] mobile-sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-[70] transform transition-transform duration-300 ease-in-out">
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </div>
        </>
      )}
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="mobile-navbar-fixed">
          <Navbar 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            rightContent={navbarRightContent}
            sidebarOpen={sidebarOpen}
          />
        </div>
        
        <div className="flex-1 mobile-content-wrapper">
          <main className="mobile-main-content">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );

  const MobileLandscapeLayout = () => (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          rightContent={navbarRightContent}
          sidebarOpen={sidebarOpen}
        />
        
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent 
            side="top" 
            className="h-[70vh] w-full p-0 bg-sidebar text-sidebar-foreground border-b border-sidebar-border z-[100]"
          >
            <Sidebar 
              closeSidebar={() => setSidebarOpen(false)} 
              isLandscapeSheet={true}
            />
          </SheetContent>
        </Sheet>
        
        <ScrollArea className="flex-1">
          <main className="flex-1 px-3 py-2 landscape-main-content">
            {children}
          </main>
          <Footer />
        </ScrollArea>
      </div>
    </div>
  );

  const DesktopLayout = () => (
    <div className="flex min-h-screen bg-background w-full">
      {/* Sidebar - now dynamically sized */}
      <div className="flex-shrink-0">
        <div className="fixed top-0 left-0 h-full z-40">
          <Sidebar closeSidebar={() => setSidebarOpen(false)} />
        </div>
      </div>
      
      {/* Main content area with proper left margin */}
      <div className="flex-1 flex flex-col min-w-0" style={{ marginLeft: '64px' }}>
        <Navbar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          rightContent={navbarRightContent}
          sidebarOpen={sidebarOpen}
        />
        
        <ScrollArea className="flex-1">
          <main className="flex-1 px-4 py-4">
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
