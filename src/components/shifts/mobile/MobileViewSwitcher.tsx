import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar, CalendarDays, CalendarRange, ChevronDown } from 'lucide-react';
import { ViewType } from '@/hooks/shifts/useMobileShifts';

interface MobileViewSwitcherProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const MobileViewSwitcher: React.FC<MobileViewSwitcherProps> = ({
  activeView,
  onViewChange
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

  const currentView = views.find(view => view.type === activeView);
  const CurrentIcon = currentView?.icon || Calendar;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 h-auto py-2 px-3"
        >
          <CurrentIcon className="h-4 w-4" />
          <span className="text-xs font-medium">{currentView?.label}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" sideOffset={8}>
        {views.map((view) => {
          const Icon = view.icon;
          return (
            <DropdownMenuItem
              key={view.type}
              onClick={() => onViewChange(view.type)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              <span>{view.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileViewSwitcher;