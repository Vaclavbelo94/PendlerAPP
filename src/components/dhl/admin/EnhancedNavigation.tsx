import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CalendarDays,
  Upload, 
  Settings,
  BarChart3,
  Clock,
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface NavigationTab {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  badge?: number;
  description: string;
}

interface EnhancedNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const EnhancedNavigation: React.FC<EnhancedNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const tabs: NavigationTab[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Přehled systému a klíčových metrik'
    },
    {
      id: 'calendar',
      title: 'Kalendář',
      icon: CalendarDays,
      description: 'Kalendářní přehled směn'
    },
    {
      id: 'employees',
      title: 'Zaměstnanci',
      icon: Users,
      description: 'Správa DHL zaměstnanců'
    },
    {
      id: 'schedules',
      title: 'Rozvrhy',
      icon: Calendar,
      description: 'Správa rozvrhů a pozic'
    },
    {
      id: 'excel-import',
      title: 'Import',
      icon: Upload,
      description: 'Import směn z Excel'
    },
    {
      id: 'timeline',
      title: 'Timeline',
      icon: Clock,
      description: 'Timeline zaměstnanců'
    },
    {
      id: 'reports',
      title: 'Reporty',
      icon: FileText,
      description: 'Generování reportů'
    },
    {
      id: 'bulk-operations',
      title: 'Hromadné operace',
      icon: CheckCircle,
      description: 'Bulk editace směn'
    },
    {
      id: 'conflict-detection',
      title: 'Detekce konfliktů',
      icon: AlertTriangle,
      description: 'Kontrola konfliktů směn'
    },
    {
      id: 'shift-templates',
      title: 'Šablony směn',
      icon: FileText,
      description: 'Správa šablon směn'
    },
    {
      id: 'settings',
      title: 'Nastavení',
      icon: Settings,
      description: 'Systémová konfigurace'
    }
  ];

  return (
    <div className="bg-background border rounded-lg p-4 mb-6">
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-4 xl:grid-cols-8 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex flex-col items-center gap-2 h-auto py-4 px-3
                  ${isActive ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'hover:bg-muted'}
                `}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {tab.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {tab.badge}
                    </Badge>
                  )}
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{tab.title}</div>
                  <div className="text-xs opacity-70 hidden xl:block">
                    {tab.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="flex gap-1 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 whitespace-nowrap min-w-fit
                  ${isActive ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'hover:bg-muted'}
                `}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{tab.title}</span>
                {tab.badge && (
                  <Badge variant="secondary" className="text-xs ml-1">
                    {tab.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EnhancedNavigation;