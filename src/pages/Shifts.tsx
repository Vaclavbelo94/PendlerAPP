
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  CalendarIcon,
  ClockIcon,
  BarChartIcon,
  PlusIcon,
  FileTextIcon
} from "lucide-react";

// Import existing components
import ShiftCalendarTab from "@/components/shifts/ShiftCalendarTab";
import PlanningTab from "@/components/shifts/PlanningTab";
import ReportsTab from "@/components/shifts/ReportsTab";
import ShiftAnalytics from "@/components/shifts/ShiftAnalytics";

const Shifts = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const isMobile = useIsMobile();

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Směny</h1>
        <p className="text-muted-foreground">
          Plánujte a sledujte své pracovní směny efektivně
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} ${isMobile ? 'max-w-full' : 'max-w-4xl'} h-auto`}>
          <TabsTrigger value="calendar" className="flex flex-col items-center gap-1 py-3 px-4">
            <CalendarIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Kalendář</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Přehled směn</span>
          </TabsTrigger>
          <TabsTrigger value="planning" className="flex flex-col items-center gap-1 py-3 px-4">
            <PlusIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Plánování</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Nové směny</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex flex-col items-center gap-1 py-3 px-4">
            <BarChartIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Analýzy</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Statistiky</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex flex-col items-center gap-1 py-3 px-4">
            <FileTextIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Reporty</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Měsíční přehledy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <ShiftCalendarTab />
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <PlanningTab />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ShiftAnalytics />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Shifts;
