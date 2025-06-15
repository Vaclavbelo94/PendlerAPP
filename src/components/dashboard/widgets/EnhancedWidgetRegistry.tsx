import React from 'react';
import { WidgetConfig, WidgetType } from './types';
import ShiftsProgress from '../ShiftsProgress';
import CommuteComparison from '../CommuteComparison';
import EducationWidget from '../EducationWidget';
import AdvancedAnalyticsWidget from '@/components/analytics/AdvancedAnalyticsWidget';
import SmartPackWidget from '@/components/language/SmartPackWidget';
import { Calendar, Languages, Car, GraduationCap, Brain, Package, BarChart3, Sparkles } from 'lucide-react';

// Enhanced widget components map
const WIDGET_COMPONENTS: Record<WidgetType | string, React.ComponentType<any>> = {
  // Original widgets
  shifts: ShiftsProgress,
  commute: CommuteComparison,
  education: EducationWidget,
  
  // New Phase 4 widgets
  'advanced-analytics': AdvancedAnalyticsWidget,
  'smart-packs': SmartPackWidget,
};

// Enhanced widget configurations with intelligent positioning
export const ENHANCED_WIDGETS: WidgetConfig[] = [
  // Core widgets (high priority)
  {
    id: 'shifts',
    type: 'shifts',
    title: 'Směny tento měsíc',
    description: 'Přehled vašich naplánovaných směn',
    icon: Calendar,
    size: 'large',
    order: 0,
    visible: true,
    category: 'core',
    priority: 'high'
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
    category: 'core',
    priority: 'high'
  },
  
  // Smart widgets (enhanced functionality)
  {
    id: 'advanced-analytics',
    type: 'advanced-analytics' as WidgetType,
    title: 'AI Analytics',
    description: 'Pokročilá analytika s AI pozorováními',
    icon: Brain,
    size: 'large',
    order: 2,
    visible: true,
    category: 'smart',
    priority: 'medium'
  },
  {
    id: 'smart-packs',
    type: 'smart-packs' as WidgetType,
    title: 'Smart Language Packs',
    description: 'AI-powered personalizované učební balíčky',
    icon: Package,
    size: 'medium',
    order: 3,
    visible: true,
    category: 'smart',
    priority: 'medium'
  },
  
  // Utility widgets
  {
    id: 'commute',
    type: 'commute',
    title: 'Náklady na dopravu',
    description: 'Porovnání nákladů na dojíždění',
    icon: Car,
    size: 'medium',
    order: 4,
    visible: true,
    category: 'utility',
    priority: 'low'
  },
  {
    id: 'education',
    type: 'education',
    title: 'Vzdělávací tipy',
    description: 'Tipy pro efektivní práci v zahraničí',
    icon: GraduationCap,
    size: 'large',
    order: 5,
    visible: true,
    category: 'utility',
    priority: 'low'
  },
];

// Smart widget positioning based on user behavior
export const getOptimizedWidgetLayout = (userPreferences: any = {}, usageData: any = {}): WidgetConfig[] => {
  const widgets = [...ENHANCED_WIDGETS];
  
  // Adjust widget order based on usage patterns
  if (usageData.mostUsedModule) {
    const mostUsedWidget = widgets.find(w => w.type === usageData.mostUsedModule);
    if (mostUsedWidget) {
      mostUsedWidget.order = -1; // Move to top
    }
  }
  
  // Hide widgets based on user preferences
  if (userPreferences.hiddenCategories) {
    userPreferences.hiddenCategories.forEach((category: string) => {
      widgets.forEach(widget => {
        if (widget.category === category) {
          widget.visible = false;
        }
      });
    });
  }
  
  // Apply intelligent sizing for mobile
  if (userPreferences.isMobile) {
    widgets.forEach(widget => {
      if (widget.size === 'large') {
        widget.size = 'medium';
      }
    });
  }
  
  return widgets.sort((a, b) => a.order - b.order);
};

// Widget recommendation engine
export const getRecommendedWidgets = (currentWidgets: WidgetConfig[], userData: any = {}): WidgetConfig[] => {
  const recommendations: WidgetConfig[] = [];
  const enabledWidgetTypes = currentWidgets.filter(w => w.visible).map(w => w.type);
  
  // Recommend AI analytics if user has learning data
  if (userData.hasLanguageData && !enabledWidgetTypes.includes('advanced-analytics')) {
    const analyticsWidget = ENHANCED_WIDGETS.find(w => w.id === 'advanced-analytics');
    if (analyticsWidget) {
      recommendations.push({
        ...analyticsWidget,
        title: '🔥 AI Analytics - Doporučeno',
        description: 'Získejte AI pozorování na základě vašeho pokroku'
      });
    }
  }
  
  // Recommend smart packs if user is actively learning
  if (userData.activeLanguageLearner && !enabledWidgetTypes.includes('smart-packs')) {
    const smartPacksWidget = ENHANCED_WIDGETS.find(w => w.id === 'smart-packs');
    if (smartPacksWidget) {
      recommendations.push({
        ...smartPacksWidget,
        title: '✨ Smart Packs - Pro vás',
        description: 'Personalizované učební balíčky na míru'
      });
    }
  }
  
  return recommendations;
};

export const getWidgetComponent = (type: WidgetType | string) => {
  return WIDGET_COMPONENTS[type];
};

export const getWidgetConfig = (id: string): WidgetConfig | undefined => {
  return ENHANCED_WIDGETS.find(widget => widget.id === id);
};

// Widget performance analytics
export const trackWidgetUsage = (widgetId: string, action: string, metadata?: any) => {
  const usageData = {
    widgetId,
    action,
    timestamp: new Date(),
    metadata
  };
  
  // Store in localStorage for now (could be sent to analytics service)
  const existingData = JSON.parse(localStorage.getItem('widget_usage') || '[]');
  existingData.push(usageData);
  
  // Keep only last 1000 entries
  if (existingData.length > 1000) {
    existingData.splice(0, existingData.length - 1000);
  }
  
  localStorage.setItem('widget_usage', JSON.stringify(existingData));
};

// Widget A/B testing
export const getWidgetVariant = (widgetId: string): 'A' | 'B' => {
  const hash = widgetId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return Math.abs(hash) % 2 === 0 ? 'A' : 'B';
};
