import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Palette, Bell, Settings as SettingsIcon, Shield, Languages, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MobileProfileSettings from './categories/MobileProfileSettings';
import MobileAppearanceSettings from './categories/MobileAppearanceSettings';
import MobileNotificationSettings from './categories/MobileNotificationSettings';
import MobileSystemSettings from './categories/MobileSystemSettings';

interface SettingsCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  badge?: string;
}

const MobileSettingsLayout = () => {
  const { t } = useTranslation('settings');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: SettingsCategory[] = [
    {
      id: 'profile',
      title: t('profile'),
      description: t('profileDescription'),
      icon: User,
      color: 'text-blue-500',
      badge: t('essential')
    },
    {
      id: 'appearance',
      title: t('appearance'),
      description: t('appearanceDescription'),
      icon: Palette,
      color: 'text-purple-500'
    },
    {
      id: 'notifications',
      title: t('notifications'),
      description: t('notificationsDescription'),
      icon: Bell,
      color: 'text-orange-500'
    },
    {
      id: 'system',
      title: t('system'),
      description: t('systemDescription'),
      icon: SettingsIcon,
      color: 'text-green-500'
    }
  ];

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'profile':
        return <MobileProfileSettings onBack={() => setSelectedCategory(null)} />;
      case 'appearance':
        return <MobileAppearanceSettings onBack={() => setSelectedCategory(null)} />;
      case 'notifications':
        return <MobileNotificationSettings onBack={() => setSelectedCategory(null)} />;
      case 'system':
        return <MobileSystemSettings onBack={() => setSelectedCategory(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div
            key="categories"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-4 space-y-4"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t('title')}
              </h1>
              <p className="text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>

            {/* Categories Grid */}
            <div className="space-y-3">
              {categories.map((category) => {
                const IconComponent = category.icon;
                
                return (
                  <Card
                    key={category.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-md active:scale-98"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-muted ${category.color}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold">
                              {category.title}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {category.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {category.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {category.badge}
                            </Badge>
                          )}
                          <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="category-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCategoryContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileSettingsLayout;