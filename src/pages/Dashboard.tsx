
import React from 'react';
import { Helmet } from "react-helmet";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import LanguageTab from "@/components/dashboard/tabs/LanguageTab"; 
import EducationTab from "@/components/dashboard/tabs/EducationTab";
import ScheduleTab from "@/components/dashboard/tabs/ScheduleTab";

const Dashboard = () => {
  return (
    <PremiumCheck featureKey="personal_dashboard">
      <div className="container py-6">
        <Helmet>
          <title>Osobní Dashboard | Pendler Buddy</title>
        </Helmet>
        <h1 className="text-3xl font-bold mb-6">Osobní Dashboard</h1>
        <div className="mb-6">
          <p className="text-muted-foreground">
            Přehled vašeho pokroku ve výuce, plánování směn a dalších aktivit.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Přehled</TabsTrigger>
            <TabsTrigger value="language">Němčina</TabsTrigger>
            <TabsTrigger value="education">Vzdělávání</TabsTrigger>
            <TabsTrigger value="schedule">Harmonogram</TabsTrigger>
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
      </div>
    </PremiumCheck>
  );
};

export default Dashboard;
