
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
          <title>Můj Dashboard | Pendler Buddy</title>
        </Helmet>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Můj Dashboard</h1>
        <div className="mb-3 sm:mb-5">
          <p className="text-sm sm:text-base text-muted-foreground">
            Centrální místo pro přehled vašeho pokroku, statistik a plánování aktivit
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 sm:space-y-4">
          <TabsList className="bg-muted/60 p-0.5 h-auto">
            <TabsTrigger value="overview" className="text-[10px] sm:text-xs py-1 sm:py-1.5">
              Celkový přehled
            </TabsTrigger>
            <TabsTrigger value="language" className="text-[10px] sm:text-xs py-1 sm:py-1.5">
              Výuka jazyka
            </TabsTrigger>
            <TabsTrigger value="education" className="text-[10px] sm:text-xs py-1 sm:py-1.5">
              Vzdělávání
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-[10px] sm:text-xs py-1 sm:py-1.5">
              Moje směny
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <div className="p-4 border-b">
                <h3 className="font-semibold">Celkový přehled</h3>
                <p className="text-sm text-muted-foreground">
                  Souhrnné statistiky vašeho pokroku ve všech oblastech
                </p>
              </div>
              <OverviewTab />
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <div className="p-4 border-b">
                <h3 className="font-semibold">Výuka němčiny</h3>
                <p className="text-sm text-muted-foreground">
                  Pokrok v učení němčiny, slovní zásoba a jazykové dovednosti
                </p>
              </div>
              <LanguageTab />
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <div className="p-4 border-b">
                <h3 className="font-semibold">Vzdělávání a certifikace</h3>
                <p className="text-sm text-muted-foreground">
                  Vaše certifikáty, kurzy a profesní rozvoj
                </p>
              </div>
              <EducationTab />
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule">
            <Card>
              <div className="p-4 border-b">
                <h3 className="font-semibold">Moje pracovní směny</h3>
                <p className="text-sm text-muted-foreground">
                  Plánování směn, odpracované hodiny a docházka
                </p>
              </div>
              <ScheduleTab />
            </Card>
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </PremiumCheck>
  );
};

export default Dashboard;
