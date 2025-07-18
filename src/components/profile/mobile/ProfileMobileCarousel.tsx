
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, User, Briefcase, Crown, Truck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import ProfileOverview from '../ProfileOverview';
import ProfileWorkData from '../ProfileWorkData';
import ProfileSubscription from '../subscription/ProfileSubscription';
import DHLProfileSettings from '../DHLProfileSettings';
import UserSubmissions from '../UserSubmissions';
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

  const getTabs = () => {
    const baseTabs = [
      { id: 'overview', label: t('overview'), icon: User },
      { id: 'workData', label: t('workData'), icon: Briefcase }
    ];
    
    if (unifiedUser?.isDHLEmployee) {
      baseTabs.push({ id: 'dhlSettings', label: t('dhlSettings'), icon: Truck });
    }
    
    baseTabs.push(
      { id: 'submissions', label: 'Moje žádosti', icon: FileText },
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

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    onTabChange(tabs[prevIndex].id);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % tabs.length;
    onTabChange(tabs[nextIndex].id);
  };

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
        return <UserSubmissions />;
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

  const currentTab = tabs[currentIndex];
  const Icon = currentTab?.icon || User;

  return (
    <div className="space-y-4">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between px-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          disabled={tabs.length <= 1}
          className="h-8 w-8 bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <Icon className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white text-center">
              {currentTab?.label}
            </h2>
          </div>
          <div className="flex justify-center space-x-1">
            {tabs.map((_, index) => (
              <button
                key={index}
                onClick={() => onTabChange(tabs[index].id)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          disabled={tabs.length <= 1}
          className="h-8 w-8 bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Tab Content with Animation */}
      <div ref={containerRef} className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tab info */}
      <div className="text-center text-sm text-white/70 px-4">
        {currentIndex + 1} z {tabs.length} • {currentTab?.label}
      </div>
    </div>
  );
};

export default ProfileMobileCarousel;
