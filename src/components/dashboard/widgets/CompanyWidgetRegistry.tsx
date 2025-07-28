import React from 'react';
import { useCompanyModuleContext } from '@/components/company/CompanyModuleProvider';
import { getWidgetComponent } from './EnhancedWidgetRegistry';
import { WidgetConfig } from './types';
import { Calendar, Clock, Building, Users } from 'lucide-react';

export const useCompanyWidgets = () => {
  const { widgets, company, getWidgetConfig } = useCompanyModuleContext();

  const getCompanySpecificWidgets = (): WidgetConfig[] => {
    return widgets.map((widget, index) => ({
      id: widget.widget_key,
      type: widget.widget_key,
      title: getWidgetTitle(widget.widget_key, company),
      description: getWidgetDescription(widget.widget_key, company),
      icon: getWidgetIcon(widget.widget_key),
      size: widget.config.size || 'medium',
      order: widget.display_order + 100, // Place after standard widgets
      visible: widget.is_enabled,
      category: 'company',
      priority: widget.config.priority || 'medium',
      metadata: widget.config
    } as WidgetConfig));
  };

  const renderCompanyWidget = (widgetKey: string) => {
    const Component = getWidgetComponent(widgetKey);
    return Component ? <Component key={widgetKey} /> : null;
  };

  return {
    getCompanySpecificWidgets,
    renderCompanyWidget,
    companyWidgets: widgets
  };
};

const getWidgetTitle = (widgetKey: string, company: string | null): string => {
  const titles: Record<string, string> = {
    'dhl_shifts': 'DHL Směny',
    'dhl_overtime': 'DHL Přesčasy',
    'dhl_wechselschicht': 'Wechselschicht',
    'dhl_notifications': 'DHL Notifikace',
    'adecco_shifts': 'Adecco Směny',
    'adecco_placements': 'Pozice',
    'randstad_shifts': 'Randstad Směny',
    'randstad_opportunities': 'Příležitosti',
  };
  
  return titles[widgetKey] || `${company?.toUpperCase()} Widget`;
};

const getWidgetDescription = (widgetKey: string, company: string | null): string => {
  const descriptions: Record<string, string> = {
    'dhl_shifts': 'Přehled vašich DHL směn a rozvrhu',
    'dhl_overtime': 'Sledování přesčasů podle směn',
    'dhl_wechselschicht': 'Střídavé směny podle DHL standardů',
    'dhl_notifications': 'Důležité notifikace od DHL',
    'adecco_shifts': 'Vaše přiřazené směny a hodnocení',
    'adecco_placements': 'Dostupné pozice a umístění',
    'randstad_shifts': 'Flexibilní směny a příležitosti',
    'randstad_opportunities': 'Nové pracovní příležitosti',
  };
  
  return descriptions[widgetKey] || `Specializovaný widget pro ${company}`;
};

const getWidgetIcon = (widgetKey: string) => {
  const icons: Record<string, any> = {
    'dhl_shifts': Calendar,
    'dhl_overtime': Clock,
    'dhl_wechselschicht': Clock,
    'dhl_notifications': Building,
    'adecco_shifts': Calendar,
    'adecco_placements': Building,
    'randstad_shifts': Calendar,
    'randstad_opportunities': Users,
  };
  
  return icons[widgetKey] || Building;
};

export default useCompanyWidgets;