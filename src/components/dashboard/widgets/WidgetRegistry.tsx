
import React from 'react';
import { WidgetConfig, WidgetType, WidgetSize } from './types';
import ShiftsProgress from '../ShiftsProgress';
import CommuteComparison from '../CommuteComparison';
import { Calendar, Car } from 'lucide-react';

// Widget components map - removed education widget
const WIDGET_COMPONENTS = {
  shifts: require('../ShiftsProgress').default,
  commute: CommuteComparison,
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
];

export const getWidgetComponent = (type: WidgetType) => {
  return WIDGET_COMPONENTS[type];
};

export const getWidgetConfig = (id: string): WidgetConfig | undefined => {
  return DEFAULT_WIDGETS.find(widget => widget.id === id);
};
