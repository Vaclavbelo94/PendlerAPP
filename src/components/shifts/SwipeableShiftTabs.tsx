import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { Calendar, BarChart3, Eye, Download, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import ShiftCalendarContainer from './calendar/ShiftCalendarContainer';
import ShiftsAnalytics from './ShiftsAnalytics';
import ShiftsExport from './ShiftsExport';
import DHLImportTab from './DHLImportTab';
import ShiftsSettings from './ShiftsSettings';
import { Shift, ShiftFormData } from '@/hooks/shifts/useShiftsCRUD';

interface SwipeableShiftTabsProps {
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => Promise<void>;
  onAddShift: () => void;
  onAddShiftForDate: (date: Date) => void;
  onSelectedDateChange?: (date: Date | undefined) => void;
  isLoading: boolean;
}

const SwipeableShiftTabs: React.FC<SwipeableShiftTabsProps> = ({
  shifts,
  onEditShift,
  onDeleteShift,
  onAddShift,
  onAddShiftForDate,
  onSelectedDateChange,
  isLoading,
}) => {
  const { t } = useTranslation('shifts');
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('calendar');

  // Check if user is DHL employee from profiles
  const isDHLEmployee = user?.user_metadata?.isDHL || false;

  const tabs = [
    {
      id: 'calendar',
      label: t('tabs.calendar'),
      icon: Calendar,
    },
    {
      id: 'overview',
      label: t('tabs.overview'),
      icon: Eye,
    },
    {
      id: 'analytics',
      label: t('tabs.analytics'),
      icon: BarChart3,
    },
    ...(isDHLEmployee ? [{
      id: 'import',
      label: t('tabs.import'),
      icon: Download,
    }] : []),
    {
      id: 'settings',
      label: t('tabs.settings'),
      icon: Settings,
    },
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Mobile-optimized tab list with horizontal scroll */}
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5 h-14 bg-muted/50 rounded-none border-b">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center gap-1 px-2 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline truncate">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab content with swipe animations */}
          <div className="relative min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                custom={0}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0"
              >
                <TabsContent value="calendar" className="m-0 p-4">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{t('tabs.calendar')}</h2>
                      <p className="text-sm text-muted-foreground">{t('shiftsDescription')}</p>
                    </div>
                    <ShiftCalendarContainer
                      shifts={shifts}
                      onEditShift={onEditShift}
                      onDeleteShift={onDeleteShift}
                      onAddShift={() => {
                        console.log('SwipeableShiftTabs - onAddShift called with no date');
                        onAddShift();
                      }}
                      onAddShiftForDate={(date) => {
                        console.log('SwipeableShiftTabs - onAddShiftForDate called with date:', date);
                        onAddShiftForDate(date);
                      }}
                      onSelectedDateChange={onSelectedDateChange}
                      isLoading={isLoading}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="overview" className="m-0 p-4">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{t('tabs.overview')}</h2>
                      <p className="text-sm text-muted-foreground">Přehled vašich směn a výdělků</p>
                    </div>
                    <ShiftsExport shifts={shifts} />
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="m-0 p-4">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{t('tabs.analytics')}</h2>
                      <p className="text-sm text-muted-foreground">Detailní analýza vašich směn</p>
                    </div>
                    <ShiftsAnalytics shifts={shifts} />
                  </div>
                </TabsContent>

                {isDHLEmployee && (
                  <TabsContent value="import" className="m-0 p-4">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">{t('tabs.import')}</h2>
                        <p className="text-sm text-muted-foreground">{t('import.description')}</p>
                      </div>
                      <DHLImportTab />
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="settings" className="m-0 p-4">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{t('tabs.settings')}</h2>
                      <p className="text-sm text-muted-foreground">Nastavení směn a preferencí</p>
                    </div>
                    <ShiftsSettings />
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SwipeableShiftTabs;