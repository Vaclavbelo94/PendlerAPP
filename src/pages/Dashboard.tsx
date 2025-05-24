
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LayoutDashboardIcon,
  BookOpenIcon,
  CalendarIcon,
  GraduationCapIcon,
  ActivityIcon
} from "lucide-react";

// Import tab content components
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import ScheduleTab from "@/components/dashboard/tabs/ScheduleTab";
import LanguageTab from "@/components/dashboard/tabs/LanguageTab";
import EducationTab from "@/components/dashboard/tabs/EducationTab";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="container py-6 md:py-10">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Přehled vašich aktivit a rychlý přístup k funkcím
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} ${isMobile ? 'max-w-full' : 'max-w-4xl'} h-auto`}>
          <TabsTrigger value="overview" className="flex flex-col items-center gap-1 py-3 px-4">
            <LayoutDashboardIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Přehled</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Hlavní dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex flex-col items-center gap-1 py-3 px-4">
            <CalendarIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Plánování</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Směny a události</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex flex-col items-center gap-1 py-3 px-4">
            <BookOpenIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Jazyk</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Pokrok v němčině</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex flex-col items-center gap-1 py-3 px-4">
            <GraduationCapIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Vzdělání</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Kurzy a certifikace</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <ScheduleTab />
        </TabsContent>

        <TabsContent value="language" className="space-y-6">
          <LanguageTab />
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <EducationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
