
import { ReactNode, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeviceSize } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  navbarRightContent?: ReactNode;
}

const Layout = ({ children, navbarRightContent }: LayoutProps) => {
  const deviceSize = useDeviceSize();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Zavřít sidebar při změně cesty (přechodu na jinou stránku)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  
  // Zavřít sidebar při změně na mobilní zobrazení
  useEffect(() => {
    if (deviceSize === "mobile") {
      setSidebarOpen(false);
    }
  }, [deviceSize]);

  // Zavřít sidebar při kliknutí mimo na mobilním zařízení
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Ignorovat kliknutí na samotné menu tlačítko
      if (target.closest('[data-menu-trigger="true"]')) {
        return;
      }
      if (deviceSize === "mobile" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen && deviceSize === "mobile") {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [sidebarOpen, deviceSize]);

  const isMobile = deviceSize === "mobile";
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - hidden on mobile by default */}
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
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          rightContent={navbarRightContent}
          sidebarOpen={sidebarOpen}
        />
        
        {/* Overlay pro mobilní sidebar */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
            role="presentation"
            aria-label="Close sidebar"
          />
        )}
        
        {/* Obsah stránky */}
        <ScrollArea className="flex-1">
          <main className="flex-1 px-4 md:px-6 pb-8">
            {children}
          </main>
          <Footer />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Layout;
