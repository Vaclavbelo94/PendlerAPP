
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
  
  // Původní layout pro desktop a portrait mobile
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - mobilní optimalizace s podporou portrait */}
      <div 
        className={`${
          isMobile 
            ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out' 
            : 'sticky top-0 h-screen'
        } ${
          isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <Sidebar 
          closeSidebar={() => setSidebarOpen(false)} 
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          rightContent={navbarRightContent}
          sidebarOpen={sidebarOpen}
        />
        
        {/* Mobilní overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        
        {/* Obsah stránky s mobilní optimalizací */}
        <ScrollArea className="flex-1">
          <main className={`flex-1 ${
            isMobile 
              ? 'px-2 py-2' 
              : 'px-4 py-4'
          }`}>
            {children}
          </main>
          <Footer />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Layout;
