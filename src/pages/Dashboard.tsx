
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import ScheduleTab from "@/components/dashboard/tabs/ScheduleTab";
import LanguageTab from "@/components/dashboard/tabs/LanguageTab";
import EducationTab from "@/components/dashboard/tabs/EducationTab";
import QuickPromoCode from "@/components/dashboard/QuickPromoCode";

const Dashboard = () => {
  const { user, isPremium } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

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

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Přehled vašich aktivit a rychlý přístup k funkcím
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 max-w-md">
          <TabsTrigger value="overview">Přehled</TabsTrigger>
          <TabsTrigger value="schedule">Rozvrh</TabsTrigger>
          <TabsTrigger value="language">Jazyky</TabsTrigger>
          <TabsTrigger value="education">Vzdělání</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Promo Code Widget - only show for non-premium users */}
            <QuickPromoCode />
            
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleTab />
        </TabsContent>

        <TabsContent value="language">
          <LanguageTab />
        </TabsContent>

        <TabsContent value="education">
          <EducationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
