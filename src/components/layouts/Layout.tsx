
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: ReactNode;
  navbarRightContent?: ReactNode;
}

const Layout = ({ children, navbarRightContent }: LayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - hidden on mobile by default */}
      <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out' : 'sticky top-0 h-screen'} ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}>
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} rightContent={navbarRightContent} />
        
        {/* Overlay for mobile sidebar */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Page content */}
        <ScrollArea className="flex-1">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Layout;
