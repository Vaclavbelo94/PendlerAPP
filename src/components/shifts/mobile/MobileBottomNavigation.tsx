import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, CalendarRange, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewType = 'month' | 'threeDays' | 'oneDay';

interface MobileBottomNavigationProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  isDHLUser?: boolean;
  onDHLImport?: () => void;
}

const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  activeView,
  onViewChange,
  isDHLUser = false,
  onDHLImport
}) => {
  const { t } = useTranslation('shifts');

  const views = [
    {
      type: 'month' as ViewType,
      label: t('mobile.monthView', 'Měsíc'),
      icon: Calendar
    },
    {
      type: 'threeDays' as ViewType,
      label: t('mobile.threeDaysView', '3 dny'),
      icon: CalendarDays
    },
    {
      type: 'oneDay' as ViewType,
      label: t('mobile.oneDayView', '1 den'),
      icon: CalendarRange
    }
  ];

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-around px-4 py-2">
        {views.map((view) => {
          const Icon = view.icon;
          const isActive = activeView === view.type;
          
          return (
            <Button
              key={view.type}
              variant="ghost"
              size="sm"
              onClick={() => onViewChange(view.type)}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-0",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium">{view.label}</span>
            </Button>
          );
        })}
        
        {/* DHL Import button for DHL users */}
        {isDHLUser && onDHLImport && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDHLImport}
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-0 text-muted-foreground hover:text-foreground"
          >
            <Download className="h-4 w-4" />
            <span className="text-xs font-medium">{t('mobile.dhlImport', 'DHL')}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileBottomNavigation;