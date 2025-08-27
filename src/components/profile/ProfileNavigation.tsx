
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, Crown, Truck, FileText } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';

export interface ProfileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation('profile');
  const { unifiedUser } = useAuth();
  
  const isDHLEmployee = unifiedUser?.isDHLEmployee;
  const gridCols = isDHLEmployee ? "grid-cols-5" : "grid-cols-4";
  
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className={`grid w-full ${gridCols}`}>
        <TabsTrigger value="overview" className="flex items-center justify-center px-4 py-3">
          <User className="h-5 w-5" />
        </TabsTrigger>
        <TabsTrigger value="workData" className="flex items-center justify-center px-4 py-3">
          <Briefcase className="h-5 w-5" />
        </TabsTrigger>
        {isDHLEmployee && (
          <TabsTrigger value="dhlSettings" className="flex items-center justify-center px-4 py-3">
            <Truck className="h-5 w-5" />
          </TabsTrigger>
        )}
        <TabsTrigger value="submissions" className="flex items-center justify-center px-4 py-3">
          <FileText className="h-5 w-5" />
        </TabsTrigger>
        <TabsTrigger value="subscription" className="flex items-center justify-center px-4 py-3">
          <Crown className="h-5 w-5" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ProfileNavigation;
