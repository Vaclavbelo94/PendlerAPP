
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import { UniversalMobileNavigation } from "@/components/navigation/UniversalMobileNavigation";
import ScheduleTab from "@/components/dashboard/tabs/ScheduleTab";
import LanguageTab from "@/components/dashboard/tabs/LanguageTab";
import EducationTab from "@/components/dashboard/tabs/EducationTab";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import QuickPromoCode from "@/components/dashboard/QuickPromoCode";
import { BarChart3, Calendar, Languages, GraduationCap } from "lucide-react";

const Dashboard = () => {
  const { user, isPremium } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const { isMobile } = useScreenOrientation();

  const dashboardTabs = [
    {
      id: "overview",
      label: "Přehled",
      icon: BarChart3,
      description: "Celkový přehled vašich aktivit"
    },
    {
      id: "schedule",
      label: "Rozvrh", 
      icon: Calendar,
      description: "Správa směn a kalendář"
    },
    {
      id: "language",
      label: "Jazyky",
      icon: Languages,
      description: "Pokrok v učení němčiny"
    },
    {
      id: "education",
      label: "Vzdělání",
      icon: GraduationCap,
      description: "Kurzy a certifikáty"
    }
  ];

  if (!user) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vítejte v PendlerApp</h1>
          <p className="text-muted-foreground mb-6">
            Pro přístup k dashboard se prosím přihlaste.
          </p>
          <Button asChild>
            <Link to="/login">Přihlásit se</Link>
          </Button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "schedule":
        return <ScheduleTab />;
      case "language":
        return <LanguageTab />;
      case "education":
        return <EducationTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Přehled vašich aktivit a rychlý přístup k funkcím
        </p>
      </div>

      <UniversalMobileNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={dashboardTabs}
      />

      <div className="space-y-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;
