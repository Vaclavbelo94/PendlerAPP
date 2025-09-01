
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Crown, Truck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import ProfileOverview from '../ProfileOverview';
import ProfileWorkData from '../ProfileWorkData';
import ProfileSubscription from '../subscription/ProfileSubscription';
import DHLProfileSettings from '../DHLProfileSettings';
import RideRequests from '../RideRequests';
import { MobileRideRequests } from './MobileRideRequests';
import { CreateNotificationTest } from '@/components/notifications/CreateNotificationTest';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';

interface ProfileMobileCarouselProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ProfileMobileCarousel: React.FC<ProfileMobileCarouselProps> = ({
  activeTab,
  onTabChange
}) => {
  const { t } = useTranslation('profile');
  const { unifiedUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Use activeTab as activeSection to match the style
  const activeSection = activeTab;

  const getTabs = () => {
    const baseTabs = [
      { id: 'overview', label: t('overview'), icon: User },
      { id: 'workData', label: t('workData'), icon: Briefcase }
    ];
    
    if (unifiedUser?.isDHLEmployee) {
      baseTabs.push({ id: 'dhlSettings', label: t('dhlSettings'), icon: Truck });
    }
    
    baseTabs.push(
      { id: 'submissions', label: t('rideRequests'), icon: FileText },
      { id: 'subscription', label: t('subscription'), icon: Crown }
    );
    
    return baseTabs;
  };

  const tabs = getTabs();
  const tabIds = tabs.map(tab => tab.id);
  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

  const { containerRef } = useSwipeNavigation({
    items: tabIds,
    currentItem: activeTab,
    onItemChange: onTabChange,
    enabled: true
  });

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ProfileOverview 
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={isEditing}
          />
        );
      case 'workData':
        return <ProfileWorkData />;
      case 'dhlSettings':
        return <DHLProfileSettings />;
      case 'submissions':
        return (
          <div className="space-y-4">
            <MobileRideRequests />
            <CreateNotificationTest />
          </div>
        );
      case 'subscription':
        return <ProfileSubscription isPremium={unifiedUser?.isPremium || false} />;
      default:
        return (
          <ProfileOverview 
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={isEditing}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation Header - Icon Only Style */}
      <div className="flex gap-1 p-1 bg-muted/30 rounded-lg border mx-4 mb-4">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeSection === tab.id ? 'default' : 'ghost'}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md transition-all ${
                activeSection === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="h-5 w-5" />
            </Button>
          );
        })}
      </div>

      {/* Tab Content with Animation */}
      <div ref={containerRef} className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 shadow-xl"
          >
            <div className="relative z-10">
              {renderTabContent()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileMobileCarousel;
