
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { useUnifiedPremiumStatus } from "@/hooks/useUnifiedPremiumStatus";
import { motion } from "framer-motion";
import { CalendarIcon, BarChart3, BookOpen, GraduationCap } from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Import refactored components
import LoadingOverview from "@/components/dashboard/LoadingOverview";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import LanguageTab from "@/components/dashboard/tabs/LanguageTab";
import ScheduleTab from "@/components/dashboard/tabs/ScheduleTab";
import EducationTab from "@/components/dashboard/tabs/EducationTab";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FEATURE_KEY = "personal-dashboard";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { canAccess } = useUnifiedPremiumStatus(FEATURE_KEY);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-2">Osobní dashboard</h1>
      <p className="text-muted-foreground mb-6">Přehled vašeho pokroku a aktivit v jednom místě</p>

      <PremiumCheck featureKey={FEATURE_KEY}>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex overflow-x-auto pb-2 md:pb-0">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="overview" className="flex gap-2 items-center">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Přehled</span>
              </TabsTrigger>
              <TabsTrigger value="language" className="flex gap-2 items-center">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Jazyk</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex gap-2 items-center">
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Směny</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="flex gap-2 items-center">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Vzdělávání</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {isLoading ? <LoadingOverview /> : <OverviewTab isLoading={isLoading} />}

            <div className="pt-4">
              <Button 
                variant="outline"
                onClick={() => {
                  setIsLoading(true); 
                  setTimeout(() => setIsLoading(false), 1500);
                }}
                disabled={isLoading}
              >
                {isLoading ? "Aktualizuje se..." : "Aktualizovat data"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="language" className="space-y-4">
            <LanguageTab isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <ScheduleTab isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <EducationTab isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </PremiumCheck>
    </div>
  );
};

export default Dashboard;
