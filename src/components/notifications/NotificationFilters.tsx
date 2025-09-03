import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationCategory } from '@/services/NotificationService';
import { useTranslation } from 'react-i18next';
import { useEnhancedNotifications } from '@/hooks/useEnhancedNotifications';
import { cn } from '@/lib/utils';

interface NotificationFiltersProps {
  selectedCategory: NotificationCategory | 'all';
  onCategoryChange: (category: NotificationCategory | 'all') => void;
  compact?: boolean;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
  compact = false
}) => {
  const { t } = useTranslation(['notifications']);
  const { notifications } = useEnhancedNotifications();

  // Count notifications by category
  const categoryCounts = notifications.reduce((acc, notification) => {
    acc[notification.category] = (acc[notification.category] || 0) + 1;
    return acc;
  }, {} as Record<NotificationCategory, number>);

  const categories: Array<{ key: NotificationCategory | 'all'; label: string }> = [
    { key: 'all', label: t('notifications:categories.all') },
    { key: 'shift', label: t('notifications:categories.shift') },
    { key: 'rideshare', label: t('notifications:categories.rideshare') },
    { key: 'system', label: t('notifications:categories.system') },
    { key: 'admin', label: t('notifications:categories.admin') }
  ];

  return (
    <div className={cn(
      'flex gap-2 overflow-x-auto scrollbar-hide',
      compact ? 'text-xs' : 'text-sm'
    )}>
      {categories.map(({ key, label }) => {
        const count = key === 'all' ? notifications.length : (categoryCounts[key as NotificationCategory] || 0);
        const isSelected = selectedCategory === key;
        
        // Hide categories with no notifications (except 'all')
        if (key !== 'all' && count === 0) return null;
        
        return (
          <Button
            key={key}
            variant={isSelected ? 'default' : 'outline'}
            size={compact ? 'sm' : 'sm'}
            onClick={() => onCategoryChange(key)}
            className={cn(
              'flex-shrink-0 h-8',
              compact && 'h-7 text-xs px-2'
            )}
          >
            {label}
            {count > 0 && (
              <Badge 
                variant={isSelected ? 'secondary' : 'default'}
                className={cn(
                  'ml-1.5 h-4 w-4 p-0 flex items-center justify-center text-xs',
                  compact && 'h-3 w-3 text-xs',
                  isSelected && 'bg-background text-foreground'
                )}
              >
                {count > 99 ? '99+' : count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
};