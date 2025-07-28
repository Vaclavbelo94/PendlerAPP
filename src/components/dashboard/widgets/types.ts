
import { LucideIcon } from 'lucide-react';

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';
export type WidgetType = 'shifts' | 'language' | 'commute' | 'education';
export type WidgetCategory = 'core' | 'smart' | 'utility' | 'analytics' | 'company';
export type WidgetPriority = 'low' | 'medium' | 'high' | 'critical';

export interface WidgetConfig {
  id: string;
  type: WidgetType | string;
  title: string;
  description: string;
  icon: LucideIcon;
  size: WidgetSize;
  order: number;
  visible: boolean;
  category?: WidgetCategory;
  priority?: WidgetPriority;
  metadata?: Record<string, any>;
}

export interface DashboardLayout {
  widgets: WidgetConfig[];
  lastModified: number;
  version?: string;
}

export interface WidgetProps {
  config: WidgetConfig;
  onUpdate?: (data: any) => void;
  onError?: (error: Error) => void;
}

// Enhanced widget capabilities
export interface SmartWidgetConfig extends WidgetConfig {
  aiEnabled?: boolean;
  crossModuleData?: string[];
  recommendations?: boolean;
  realTimeUpdates?: boolean;
  personalizedContent?: boolean;
}

export interface WidgetUsageData {
  widgetId: string;
  views: number;
  interactions: number;
  timeSpent: number;
  lastAccessed: Date;
  preferredSize?: WidgetSize;
}

export interface WidgetRecommendation {
  widgetId: string;
  reason: string;
  confidence: number;
  category: 'feature' | 'optimization' | 'personalization';
  estimatedBenefit: string;
}
