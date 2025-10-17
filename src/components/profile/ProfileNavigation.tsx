
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, Crown, Truck, FileText } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { useIsMobile } from '@/hooks/use-mobile';

export interface ProfileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation('profile');
  const { unifiedUser } = useAuth();
  const isMobile = useIsMobile();
  
  const isDHLEmployee = unifiedUser?.isDHLEmployee;
  const gridCols = isDHLEmployee ? "grid-cols-5" : "grid-cols-4";
  
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className={`grid w-full ${gridCols} ${isMobile ? 'overflow-x-auto scrollbar-hide' : ''}`}>
        <TabsTrigger value="overview" className="flex items-center justify-center min-h-[var(--touch-target)]">
          <User className="h-5 w-5 md:h-4 md:w-4" />
        </TabsTrigger>
        <TabsTrigger value="workData" className="flex items-center justify-center min-h-[var(--touch-target)]">
          <Briefcase className="h-5 w-5 md:h-4 md:w-4" />
        </TabsTrigger>
        {isDHLEmployee && (
          <TabsTrigger value="dhlSettings" className="flex items-center justify-center min-h-[var(--touch-target)]">
            <Truck className="h-5 w-5 md:h-4 md:w-4" />
          </TabsTrigger>
        )}
        <TabsTrigger value="submissions" className="flex items-center justify-center min-h-[var(--touch-target)]">
          <FileText className="h-5 w-5 md:h-4 md:w-4" />
        </TabsTrigger>
        <TabsTrigger value="subscription" className="flex items-center justify-center min-h-[var(--touch-target)]">
          <Crown className="h-5 w-5 md:h-4 md:w-4" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ProfileNavigation;
