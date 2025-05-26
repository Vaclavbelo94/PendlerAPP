
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/useAuth";
import { useStandardizedToast } from "@/hooks/useStandardizedToast";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import DashboardCard from "@/components/dashboard/DashboardCard";
import LoadingOverview from "@/components/dashboard/LoadingOverview";
import EducationWidget from "@/components/dashboard/EducationWidget";
import LanguageStatsWidget from "@/components/dashboard/LanguageStatsWidget";
import ShiftsProgress from "@/components/dashboard/ShiftsProgress";
import CommuteComparison from "@/components/dashboard/CommuteComparison";

const Dashboard = () => {
  const { user } = useAuth();
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

      {/* Main dashboard grid */}
      <div className="grid gap-6 mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Shifts Progress */}
        <DashboardCard
          title="Směny tento měsíc"
          description="Přehled vašich naplánovaných směn"
          className="lg:col-span-2"
        >
          <ShiftsProgress />
        </DashboardCard>

        {/* Language Learning Stats */}
        <DashboardCard
          title="Jazykový pokrok"
          description="Váš pokrok v učení německého jazyka"
        >
          <LanguageStatsWidget />
        </DashboardCard>

        {/* Commute Comparison */}
        <DashboardCard
          title="Náklady na dopravu"
          description="Porovnání nákladů na dojíždění"
          className="md:col-span-2 lg:col-span-1"
        >
          <CommuteComparison />
        </DashboardCard>

        {/* Education Widget */}
        <DashboardCard
          title="Vzdělávací tipy"
          description="Tipy pro efektivní práci v zahraničí"
          className="lg:col-span-2"
        >
          <EducationWidget />
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
