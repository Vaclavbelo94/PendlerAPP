
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, Crown } from "lucide-react";

export interface ProfileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Přehled
        </TabsTrigger>
        <TabsTrigger value="workData" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          Pracovní data
        </TabsTrigger>
        <TabsTrigger value="subscription" className="flex items-center gap-2">
          <Crown className="h-4 w-4" />
          Předplatné
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ProfileNavigation;
