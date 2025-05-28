
import { LucideIcon } from 'lucide-react';

export type WidgetType = 'shifts' | 'language' | 'commute' | 'education';
export type WidgetSize = 'small' | 'medium' | 'large';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  icon: LucideIcon;
  size: WidgetSize;
  order: number;
  visible: boolean;
}

export interface DashboardLayout {
  widgets: WidgetConfig[];
  lastModified: number;
}
