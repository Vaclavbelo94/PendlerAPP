
import React, { useState, useCallback, useMemo } from "react";
import { useSimplifiedAuth } from "@/hooks/auth/useSimplifiedAuth";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import { UniversalMobileNavigation } from "@/components/navigation/UniversalMobileNavigation";
import OptimizedPremiumCheck from '@/components/premium/OptimizedPremiumCheck';
import ResponsivePage from "@/components/layouts/ResponsivePage";
import { ErrorBoundaryWithFallback } from "@/components/common/ErrorBoundaryWithFallback";
import FastLoadingFallback from "@/components/common/FastLoadingFallback";
import { Calendar, BarChart3, FileText, Settings } from "lucide-react";

// Optimized lazy loading with better error handling
const ShiftsHeader = React.lazy(() => 
  import("@/components/shifts/ShiftsHeader").then(module => ({ default: module.ShiftsHeader })).catch(err => {
    console.error('Failed to load ShiftsHeader:', err);
    return { default: () => <div className="p-4 text-center text-muted-foreground">Hlavička směn se nenačetla</div> };
  })
);

const ShiftsContent = React.lazy(() => 
  import("@/components/shifts/ShiftsContent").catch(err => {
    console.error('Failed to load ShiftsContent:', err);
    return { default: () => <div className="p-4 text-center text-muted-foreground">Obsah směn se nenačetl</div> };
  })
);

const MobileShiftActions = React.lazy(() => 
  import("@/components/shifts/mobile/MobileShiftActions").catch(err => {
    console.error('Failed to load MobileShiftActions:', err);
    return { default: () => null };
  })
);

const ShiftWidgets = React.lazy(() => 
  import("@/components/shifts/dashboard/ShiftWidgets").then(module => ({ default: module.ShiftWidgets })).catch(err => {
    console.error('Failed to load ShiftWidgets:', err);
    return { default: () => null };
  })
);

const Shifts = () => {
  const [activeSection, setActiveSection] = useState("calendar");
  const { user, isLoading: authLoading, isInitialized } = useSimplifiedAuth();
  const { isMobile } = useScreenOrientation();

  console.log('Shifts page rendering, user:', user?.email, 'authLoading:', authLoading);

  const shiftTabs = useMemo(() => [
    {
      id: "calendar",
      label: "Kalendář",
      icon: Calendar,
      description: "Plánování a správa směn"
    },
    {
      id: "analytics",
      label: "Analýzy",
      icon: BarChart3,
      description: "Statistiky a grafy směn"
    },
    {
      id: "reports",
      label: "Reporty",
      icon: FileText,
      description: "Exporty a sestavy"
    },
    {
      id: "settings",
      label: "Nastavení",
      icon: Settings,
      description: "Konfigurace směn"
    }
  ], []);

  const handleQuickAdd = useCallback(() => setActiveSection("calendar"), []);
  const handleNotificationSettings = useCallback(() => setActiveSection("settings"), []);
  const handleShareSchedule = useCallback(() => setActiveSection("reports"), []);

  // Show loading only while auth is initializing
  if (!isInitialized || authLoading) {
    return (
      <OptimizedPremiumCheck featureKey="shifts">
        <ResponsivePage>
          <FastLoadingFallback message="Načítání směn..." />
        </ResponsivePage>
      </OptimizedPremiumCheck>
    );
  }

  return (
    <OptimizedPremiumCheck featureKey="shifts">
      <ResponsivePage>
        <ErrorBoundaryWithFallback>
          <div className="container py-6 md:py-10 max-w-7xl mx-auto">
            <React.Suspense fallback={<FastLoadingFallback message="Načítám hlavičku..." minimal />}>
              <ShiftsHeader />
            </React.Suspense>

            <React.Suspense fallback={<div />}>
              <MobileShiftActions
                onQuickAdd={handleQuickAdd}
                onNotificationSettings={handleNotificationSettings}
                onShareSchedule={handleShareSchedule}
              />
            </React.Suspense>

            <React.Suspense fallback={<div />}>
              <ShiftWidgets shifts={[]} />
            </React.Suspense>

            <UniversalMobileNavigation
              activeTab={activeSection}
              onTabChange={setActiveSection}
              tabs={shiftTabs}
            />

            <React.Suspense fallback={<FastLoadingFallback message="Načítám obsah směn..." />}>
              <ShiftsContent />
            </React.Suspense>
          </div>
        </ErrorBoundaryWithFallback>
      </ResponsivePage>
    </OptimizedPremiumCheck>
  );
};

export default Shifts;
