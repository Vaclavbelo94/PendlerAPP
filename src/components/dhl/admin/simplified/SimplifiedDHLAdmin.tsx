import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Clock, BarChart3, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LanguageSelector from './LanguageSelector';
import GroupManager from './GroupManager';
import BulkShiftSetter from './BulkShiftSetter';
import QuickDashboard from './QuickDashboard';
import WechselschichtManager from '../wechselschicht/WechselschichtManager';

export type AdminSection = 'dashboard' | 'groups' | 'shifts' | 'wechselschicht';

const SimplifiedDHLAdmin = () => {
  const { t } = useTranslation(['dhl', 'common']);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  const sections = [
    {
      id: 'dashboard' as AdminSection,
      title: t('admin.dashboard.title'),
      description: t('admin.dashboard.description'),
      icon: BarChart3,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'groups' as AdminSection,
      title: t('admin.groups.title'),
      description: t('admin.groups.description'),
      icon: Users,
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      id: 'shifts' as AdminSection,
      title: t('admin.shifts.title'),
      description: t('admin.shifts.description'),
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    },
    {
      id: 'wechselschicht' as AdminSection,
      title: 'Wechselschicht 30h',
      description: 'Správa 15 rotačních vzorců směn',
      icon: RefreshCw,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <QuickDashboard />;
      case 'groups':
        return <GroupManager />;
      case 'shifts':
        return <BulkShiftSetter />;
      case 'wechselschicht':
        return <WechselschichtManager />;
      default:
        return <QuickDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
      <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
        {/* Header with Language Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-600 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t('admin.title')}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {t('admin.subtitle')}
              </p>
            </div>
          </div>
          <LanguageSelector />
        </div>

        {/* Section Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <Card 
                key={section.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isActive ? 'ring-2 ring-yellow-500 bg-yellow-50 dark:bg-yellow-950/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${section.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {section.title}
                        {isActive && (
                          <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                            {t('common.active')}
                          </Badge>
                        )}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Active Section Content */}
        <div className="min-h-[600px]">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default SimplifiedDHLAdmin;