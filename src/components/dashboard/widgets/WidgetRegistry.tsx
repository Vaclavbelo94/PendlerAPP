
import React from 'react';
import { WidgetConfig, WidgetType, WidgetSize } from './types';
import ShiftsProgress from '../ShiftsProgress';
import CommuteComparison from '../CommuteComparison';
import EducationWidget from '../EducationWidget';
import { Calendar, Car, GraduationCap } from 'lucide-react';

// Widget components map
const WIDGET_COMPONENTS = {
  shifts: require('../ShiftsProgress').default,
  commute: CommuteComparison,
  education: EducationWidget,
};

export const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: 'shifts',
    type: 'shifts',
    title: 'Směny tento měsíc',
    description: 'Přehled vašich naplánovaných směn',
    icon: Calendar,
    size: 'large' as WidgetSize,
    order: 0,
    visible: true,
  },
  {
    id: 'commute',
    type: 'commute',
    title: 'Náklady na dopravu',
    description: 'Porovnání nákladů na dojíždění',
    icon: Car,
    size: 'medium' as WidgetSize,
    order: 1,
    visible: true,
  },
  {
    id: 'education',
    type: 'education',
    title: 'Vzdělávací tipy',
    description: 'Tipy pro efektivní práci v zahraničí',
    icon: GraduationCap,
    size: 'large' as WidgetSize,
    order: 2,
    visible: true,
  },
];

export const getWidgetComponent = (type: WidgetType) => {
  return WIDGET_COMPONENTS[type];
};

export const getWidgetConfig = (id: string): WidgetConfig | undefined => {
  return DEFAULT_WIDGETS.find(widget => widget.id === id);
};
