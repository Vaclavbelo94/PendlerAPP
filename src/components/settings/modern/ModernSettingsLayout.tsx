import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Palette, Bell, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import SettingsCategory from './SettingsCategory';
import ProfileSettings from './categories/ProfileSettings';
import AppearanceSettings from './categories/AppearanceSettings';
import NotificationSettings from './categories/NotificationSettings';
import SystemSettings from './categories/SystemSettings';

const ModernSettingsLayout = () => {
  const { t } = useTranslation('settings');
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'profile',
      title: t('profile'),
      description: t('profileDescription'),
      icon: User,
      color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30'
    },
    {
      id: 'appearance',
      title: t('appearance'),
      description: t('appearanceDescription'),
      icon: Palette,
      color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30'
    },
    {
      id: 'notifications',
      title: t('notifications'),
      description: t('notificationsDescription'),
      icon: Bell,
      color: 'from-green-500/20 to-green-600/20 border-green-500/30'
    },
    {
      id: 'system',
      title: t('system'),
      description: t('systemDescription'),
      icon: Settings,
      color: 'from-orange-500/20 to-orange-600/20 border-orange-500/30'
    }
  ];

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'profile':
        return <ProfileSettings onBack={() => setSelectedCategory(null)} />;
      case 'appearance':
        return <AppearanceSettings onBack={() => setSelectedCategory(null)} />;
      case 'notifications':
        return <NotificationSettings onBack={() => setSelectedCategory(null)} />;
      case 'system':
        return <SystemSettings onBack={() => setSelectedCategory(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
        {selectedCategory ? (
          <motion.div
            key="category-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderCategoryContent()}
          </motion.div>
        ) : (
          <motion.div
            key="category-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full overflow-y-auto"
          >
            <div className={`grid gap-4 p-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {categories.map((category) => (
                <SettingsCategory
                  key={category.id}
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  colorClass={category.color}
                  onClick={() => setSelectedCategory(category.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernSettingsLayout;