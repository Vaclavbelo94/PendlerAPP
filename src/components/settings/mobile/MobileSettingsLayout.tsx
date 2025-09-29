import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Palette, Bell, Settings as SettingsIcon, Building2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCompany } from '@/hooks/useCompany';
import MobileProfilePage from './pages/MobileProfilePage';
import MobileAppearancePage from './pages/MobileAppearancePage';
import MobileNotificationPage from './pages/MobileNotificationPage';
import MobileSystemPage from './pages/MobileSystemPage';
import MobileDHLPage from './pages/MobileDHLPage';

const MobileSettingsLayout = () => {
  const { t } = useTranslation('settings');
  const { isDHL } = useCompany();
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  const settingsCategories = [
    {
      id: 'profile',
      label: t('profileAccount'),
      description: t('profileAccountDesc'),
      icon: User,
      component: MobileProfilePage
    },
    {
      id: 'appearance',
      label: t('appearance'),
      description: t('appearanceDesc'),
      icon: Palette,
      component: MobileAppearancePage
    },
    {
      id: 'notifications',
      label: t('notifications'),
      description: t('notificationsDesc'),
      icon: Bell,
      component: MobileNotificationPage
    },
    {
      id: 'system',
      label: t('system'),
      description: t('systemDesc'),
      icon: SettingsIcon,
      component: MobileSystemPage
    },
    ...(isDHL ? [{
      id: 'dhl',
      label: t('dhlSettings'),
      description: t('dhlSettingsDesc'),
      icon: Building2,
      component: MobileDHLPage
    }] : [])
  ];

  const handleBack = () => {
    setCurrentPage(null);
  };

  const handleCategorySelect = (categoryId: string) => {
    setCurrentPage(categoryId);
  };

  // Render specific page if selected
  if (currentPage) {
    const category = settingsCategories.find(cat => cat.id === currentPage);
    if (category) {
      const PageComponent = category.component;
      return (
        <div className="min-h-screen bg-background">
          {/* Header with back button */}
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-20 p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  {category.label}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </div>
          </div>

          {/* Page content */}
          <PageComponent />
        </div>
      );
    }
  }

  // Render main settings menu
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-20 p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground mb-1">
            {t('title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="p-4 space-y-2">
        {settingsCategories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            size="lg"
            onClick={() => handleCategorySelect(category.id)}
            className="w-full justify-between h-auto py-4 px-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <category.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">{category.label}</div>
                <div className="text-sm text-muted-foreground">
                  {category.description}
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileSettingsLayout;