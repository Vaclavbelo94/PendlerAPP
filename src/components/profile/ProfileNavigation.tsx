
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, Crown, Truck } from "lucide-react";
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
  const gridCols = isDHLEmployee ? "grid-cols-4" : "grid-cols-3";
  
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className={`grid w-full ${gridCols}`}>
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          {t('overview')}
        </TabsTrigger>
        <TabsTrigger value="workData" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          {t('workData')}
        </TabsTrigger>
        {isDHLEmployee && (
          <TabsTrigger value="dhlSettings" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            {t('dhlSettings')}
          </TabsTrigger>
        )}
        <TabsTrigger value="subscription" className="flex items-center gap-2">
          <Crown className="h-4 w-4" />
          {t('subscription')}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ProfileNavigation;
