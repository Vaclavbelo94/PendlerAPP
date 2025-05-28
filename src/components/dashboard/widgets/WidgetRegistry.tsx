
import React from 'react';
import { WidgetConfig, WidgetType } from './types';
import ShiftsProgress from '../ShiftsProgress';
import LanguageStatsWidget from '../LanguageStatsWidget';
import CommuteComparison from '../CommuteComparison';
import EducationWidget from '../EducationWidget';
import { Calendar, Languages, Car, GraduationCap, TrendingUp, Clock } from 'lucide-react';

// Widget components map
const WIDGET_COMPONENTS: Record<WidgetType, React.ComponentType<any>> = {
  shifts: ShiftsProgress,
  language: LanguageStatsWidget,
  commute: CommuteComparison,
  education: EducationWidget,
};

// Default widget configurations
export const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: 'shifts',
    type: 'shifts',
    title: 'Směny tento měsíc',
    description: 'Přehled vašich naplánovaných směn',
    icon: Calendar,
    size: 'large',
    order: 0,
    visible: true,
  },
  {
    id: 'language',
    type: 'language',
    title: 'Jazykový pokrok',
    description: 'Váš pokrok v učení německého jazyka',
    icon: Languages,
    size: 'medium',
    order: 1,
    visible: true,
  },
  {
    id: 'commute',
    type: 'commute',
    title: 'Náklady na dopravu',
    description: 'Porovnání nákladů na dojíždění',
    icon: Car,
    size: 'medium',
    order: 2,
    visible: true,
  },
  {
    id: 'education',
    type: 'education',
    title: 'Vzdělávací tipy',
    description: 'Tipy pro efektivní práci v zahraničí',
    icon: GraduationCap,
    size: 'large',
    order: 3,
    visible: true,
  },
];

export const getWidgetComponent = (type: WidgetType) => {
  return WIDGET_COMPONENTS[type];
};

export const getWidgetConfig = (id: string): WidgetConfig | undefined => {
  return DEFAULT_WIDGETS.find(widget => widget.id === id);
};
