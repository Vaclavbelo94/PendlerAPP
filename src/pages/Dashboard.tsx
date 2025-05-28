import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/useAuth";
import { useStandardizedToast } from "@/hooks/useStandardizedToast";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import LoadingOverview from "@/components/dashboard/LoadingOverview";
import { DashboardLayoutManager } from "@/components/dashboard/widgets/DashboardLayoutManager";
import { MobileDashboardCarousel } from "@/components/dashboard/widgets/MobileDashboardCarousel";
import { DesktopDashboardGrid } from "@/components/dashboard/widgets/DesktopDashboardGrid";
import { DashboardControls } from "@/components/dashboard/widgets/DashboardControls";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";

const Dashboard = () => {
  const { user } = useAuth();
  const { isMobile } = useScreenOrientation();
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const { toast } = useStandardizedToast();

  useEffect(() => {
    // Check if this is the user's first visit to dashboard
    const hasVisitedBefore = localStorage.getItem("hasVisitedDashboard");
    if (!hasVisitedBefore && user) {
      setIsFirstVisit(true);
      localStorage.setItem("hasVisitedDashboard", "true");
      
      // Show welcome toast
      setTimeout(() => {
        toast({
          title: "Vítejte v Pendlerově Pomocníkovi",
          description: "Postupujte podle rychlého průvodce pro nastavení vašeho účtu",
          variant: "info",
          duration: 6000
        });
      }, 1500);
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, toast]);

  if (isLoading) {
    return <LoadingOverview />;
  }

  return (
    <div className="container py-6 max-w-7xl">
      <Helmet>
        <title>Dashboard | Pendlerův Pomocník</title>
      </Helmet>

      {/* Welcome or Quick Start Section */}
      <WelcomeSection />

      {/* Dashboard Controls - only on desktop */}
      {!isMobile && (
        <div className="flex justify-end mb-6">
          <DashboardLayoutManager>
            {(widgets, onReorder) => (
              <DashboardControls
                onResetLayout={() => {
                  localStorage.removeItem('dashboard_layout');
                  window.location.reload();
                }}
                onOpenSettings={() => {
                  toast({
                    title: "Nastavení widgetů",
                    description: "Přetáhněte widgety pro změnu pořadí",
                    variant: "info"
                  });
                }}
              />
            )}
          </DashboardLayoutManager>
        </div>
      )}

      {/* Main dashboard content */}
      <div className="mt-8">
        <DashboardLayoutManager>
          {(widgets, onReorder) => (
            <>
              {isMobile ? (
                <MobileDashboardCarousel widgets={widgets} />
              ) : (
                <DesktopDashboardGrid widgets={widgets} />
              )}
            </>
          )}
        </DashboardLayoutManager>
      </div>
    </div>
  );
};

export default Dashboard;
