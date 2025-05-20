
import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import LanguageTab from "@/components/dashboard/tabs/LanguageTab"; 
import EducationTab from "@/components/dashboard/tabs/EducationTab";
import ScheduleTab from "@/components/dashboard/tabs/ScheduleTab";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { useMediaQuery } from "@/hooks/use-media-query";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useMediaQuery("xs");
  
  return (
    <PremiumCheck featureKey="personal_dashboard">
      <ResponsiveContainer className="py-4 sm:py-6">
        <Helmet>
          <title>Osobní Dashboard | Pendler Buddy</title>
        </Helmet>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Osobní Dashboard</h1>
        <div className="mb-3 sm:mb-5">
          <p className="text-sm sm:text-base text-muted-foreground">
            Přehled vašeho pokroku ve výuce, plánování směn a dalších aktivit.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 sm:space-y-4">
          <TabsList className="bg-muted/60 p-0.5 h-auto">
            <TabsTrigger value="overview" className="text-[10px] sm:text-xs py-1 sm:py-1.5">Přehled</TabsTrigger>
            <TabsTrigger value="language" className="text-[10px] sm:text-xs py-1 sm:py-1.5">Němčina</TabsTrigger>
            <TabsTrigger value="education" className="text-[10px] sm:text-xs py-1 sm:py-1.5">Vzdělávání</TabsTrigger>
            <TabsTrigger value="schedule" className="text-[10px] sm:text-xs py-1 sm:py-1.5">Harmonogram</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <OverviewTab />
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <LanguageTab />
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <EducationTab />
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule">
            <Card>
              <ScheduleTab />
            </Card>
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </PremiumCheck>
  );
};

export default Dashboard;
