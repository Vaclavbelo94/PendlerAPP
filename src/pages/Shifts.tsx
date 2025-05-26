
import React, { useState, useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import { UniversalMobileNavigation } from "@/components/navigation/UniversalMobileNavigation";
import PremiumCheck from '@/components/premium/PremiumCheck';
import ResponsivePage from "@/components/layouts/ResponsivePage";
import { ErrorBoundaryWithFallback } from "@/components/common/ErrorBoundaryWithFallback";
import LoadingFallback from "@/components/common/LoadingFallback";
import { Calendar, BarChart3, FileText, Settings } from "lucide-react";
import { useUnifiedShiftManagement } from "@/components/shifts/hooks/useUnifiedShiftManagement";

// Lazy load components with proper error handling
const ShiftsHeader = React.lazy(() => 
  import("@/components/shifts/ShiftsHeader").then(module => ({ default: module.ShiftsHeader })).catch(err => {
    console.error('Failed to load ShiftsHeader:', err);
    return { default: () => <div>Chyba při načítání hlavičky směn</div> };
  })
);

const ShiftsContent = React.lazy(() => 
  import("@/components/shifts/ShiftsContent").catch(err => {
    console.error('Failed to load ShiftsContent:', err);
    return { default: () => <div>Chyba při načítání obsahu směn</div> };
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
  const { user, isLoading: authLoading } = useAuth();
  const { isMobile } = useScreenOrientation();

  // Use the unified shift management hook
  const shiftManagement = useUnifiedShiftManagement(user);

  console.log('Shifts page rendering, user:', user?.email, 'authLoading:', authLoading);

  const shiftTabs = [
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
  ];

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <PremiumCheck featureKey="shifts">
        <ResponsivePage>
          <LoadingFallback message="Načítání směn..." />
        </ResponsivePage>
      </PremiumCheck>
    );
  }

  return (
    <PremiumCheck featureKey="shifts">
      <ResponsivePage>
        <ErrorBoundaryWithFallback>
          <div className="container py-6 md:py-10 max-w-7xl mx-auto">
            <React.Suspense fallback={<LoadingFallback message="Načítám hlavičku..." />}>
              <ShiftsHeader />
            </React.Suspense>

            <React.Suspense fallback={<div />}>
              <MobileShiftActions
                onQuickAdd={() => setActiveSection("calendar")}
                onNotificationSettings={() => setActiveSection("settings")}
                onShareSchedule={() => setActiveSection("reports")}
              />
            </React.Suspense>

            <React.Suspense fallback={<div />}>
              <ShiftWidgets shifts={shiftManagement.shifts || []} />
            </React.Suspense>

            <UniversalMobileNavigation
              activeTab={activeSection}
              onTabChange={setActiveSection}
              tabs={shiftTabs}
            />

            <React.Suspense fallback={<LoadingFallback message="Načítám obsah směn..." />}>
              <ShiftsContent />
            </React.Suspense>
          </div>
        </ErrorBoundaryWithFallback>
      </ResponsivePage>
    </PremiumCheck>
  );
};

export default Shifts;
