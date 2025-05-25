
import { ReactNode, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile, useOrientation } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  navbarRightContent?: ReactNode;
}

const Layout = ({ children, navbarRightContent }: LayoutProps) => {
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Zavřít sidebar při změně cesty (přechodu na jinou stránku)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  
  // Zavřít sidebar při kliknutí mimo na mobilním zařízení
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Ignorovat kliknutí na samotné menu tlačítko
      if (target.closest('[data-menu-trigger="true"]')) {
        return;
      }
      if (isMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen && isMobile) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [sidebarOpen, isMobile]);

  // Určit, zda je v landscape módu na mobilním zařízení
  const isLandscapeMobile = isMobile && orientation === "landscape";
  const isPortraitMobile = isMobile && orientation === "portrait";
  
  // Renderovat landscape mobile layout s Sheet komponentou
  if (isLandscapeMobile) {
    return (
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
              className="h-[70vh] w-full p-0 bg-sidebar text-sidebar-foreground border-b border-sidebar-border"
            >
              <Sidebar 
                closeSidebar={() => setSidebarOpen(false)} 
                isLandscapeSheet={true}
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
  }
  
  // Optimalizovaný layout pro portrait mobile
  if (isPortraitMobile) {
    return (
      <div className="flex min-h-screen bg-background relative">
        {/* Sidebar pro portrait mobile - vždy jako overlay */}
        {sidebarOpen && (
          <>
            {/* Mobilní overlay backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            {/* Sidebar overlay */}
            <div className="fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out">
              <Sidebar closeSidebar={() => setSidebarOpen(false)} />
            </div>
          </>
        )}
        
        {/* Main content container */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <Navbar 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            rightContent={navbarRightContent}
            sidebarOpen={sidebarOpen}
          />
          
          {/* Obsah stránky s mobilní optimalizací */}
          <ScrollArea className="flex-1">
            <main className="flex-1 px-3 py-3 min-h-[calc(100vh-4rem)]">
              {children}
            </main>
            <Footer />
          </ScrollArea>
        </div>
      </div>
    );
  }
  
  // Desktop layout (původní)
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="sticky top-0 h-screen">
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          rightContent={navbarRightContent}
          sidebarOpen={sidebarOpen}
        />
        
        {/* Obsah stránky */}
        <ScrollArea className="flex-1">
          <main className="flex-1 px-4 py-4">
            {children}
          </main>
          <Footer />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Layout;
