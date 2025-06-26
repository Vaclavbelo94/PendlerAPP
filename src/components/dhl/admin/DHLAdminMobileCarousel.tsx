
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Upload, FileText, Users, CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { ScheduleUploader } from './ScheduleUploader';
import { SchedulesList } from './SchedulesList';
import { PositionManagementPanel } from './PositionManagementPanel';
import { ImportHistory } from './ImportHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import './MobileDHLStyles.css';

interface DHLAdminMobileCarouselProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DHLAdminMobileCarousel: React.FC<DHLAdminMobileCarouselProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'upload', label: 'Import', icon: Upload, description: 'Nahrát plán směn' },
    { id: 'schedules', label: 'Plány', icon: FileText, description: 'Přehled plánů směn' },
    { id: 'positions', label: 'Pozice', icon: Users, description: 'Správa pozic' },
    { id: 'history', label: 'Historie', icon: CheckCircle, description: 'Historie importů' },
    { id: 'generate', label: 'Gen.', icon: Download, description: 'Generování směn' }
  ];

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

  const renderUploadContent = () => {
    return (
      <>
        <Card className="dhl-mobile-card">
          <CardHeader className="dhl-mobile-card-header">
            <CardTitle className="dhl-mobile-card-title flex items-center gap-2">
              <Upload className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Nahrát plán směn</span>
            </CardTitle>
            <CardDescription className="dhl-mobile-card-description">
              Nahrajte JSON soubor s plánem směn pro konkrétní pozici a pracovní skupinu
            </CardDescription>
          </CardHeader>
          <CardContent className="dhl-mobile-card-content dhl-mobile-upload-section">
            <ScheduleUploader />
          </CardContent>
        </Card>

        <Card className="dhl-mobile-card">
          <CardHeader className="dhl-mobile-card-header">
            <CardTitle className="dhl-mobile-card-title">Formát JSON souboru</CardTitle>
            <CardDescription className="dhl-mobile-card-description">
              Požadovaná struktura pro import plánů směn
            </CardDescription>
          </CardHeader>
          <CardContent className="dhl-mobile-card-content">
            <div className="space-y-4">
              <div className="dhl-mobile-format-info">
                <h4 className="dhl-mobile-format-title">Povinné pole:</h4>
                <ul className="dhl-mobile-format-list space-y-1">
                  <li><code>base_date</code> - Referenční datum (YYYY-MM-DD)</li>
                  <li><code>woche</code> - Číslo týdne v cyklu (1-15)</li>
                  <li><code>YYYY-MM-DD</code> - Konkrétní data se směnami</li>
                </ul>
              </div>
              
              <div className="dhl-mobile-format-info">
                <h4 className="dhl-mobile-format-title">Struktura směny:</h4>
                <ul className="dhl-mobile-format-list space-y-1">
                  <li><code>start_time</code> - Začátek směny (HH:MM)</li>
                  <li><code>end_time</code> - Konec směny (HH:MM)</li>
                  <li><code>day</code> - Den v týdnu (volitelné)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  const renderGenerateContent = () => {
    return (
      <Card className="dhl-mobile-card">
        <CardHeader className="dhl-mobile-card-header">
          <CardTitle className="dhl-mobile-card-title">Generování směn</CardTitle>
          <CardDescription className="dhl-mobile-card-description">
            Automatické generování směn pro zaměstnance na základě importovaných plánů
          </CardDescription>
        </CardHeader>
        <CardContent className="dhl-mobile-card-content">
          <div className="space-y-4">
            <div className="dhl-mobile-schedule-item border rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-sm sm:text-base dhl-text-wrap">Bulk generování směn</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 dhl-text-wrap">
                    Vygeneruje směny pro všechny zaměstnance na základě jejich pozice a pracovní skupiny
                  </p>
                </div>
                <Button className="w-full sm:w-auto dhl-mobile-button sm:dhl-mobile-button-secondary">
                  Generovat všechny směny
                </Button>
              </div>
            </div>

            <div className="dhl-mobile-schedule-item border rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-sm sm:text-base dhl-text-wrap">Nastavení Woche referenčních bodů</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 dhl-text-wrap">
                    Správa individuálních referenčních bodů zaměstnanců pro výpočet Woche
                  </p>
                </div>
                <Button variant="outline" className="w-full sm:w-auto dhl-mobile-button sm:dhl-mobile-button-secondary">
                  Spravovat reference
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return renderUploadContent();
      case 'schedules':
        return <SchedulesList />;
      case 'positions':
        return <PositionManagementPanel />;
      case 'history':
        return <ImportHistory />;
      case 'generate':
        return renderGenerateContent();
      default:
        return renderUploadContent();
    }
  };

  const currentTab = tabs[currentIndex];
  const Icon = currentTab?.icon || Upload;

  return (
    <div className="space-y-4">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between px-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          disabled={tabs.length <= 1}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-center">
              {currentTab?.label}
            </h2>
          </div>
          <div className="flex justify-center space-x-1">
            {tabs.map((_, index) => (
              <button
                key={index}
                onClick={() => onTabChange(tabs[index].id)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
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
          className="h-8 w-8"
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
      <div className="text-center text-sm text-muted-foreground px-4">
        {currentIndex + 1} z {tabs.length} • {currentTab?.description}
      </div>
    </div>
  );
};
