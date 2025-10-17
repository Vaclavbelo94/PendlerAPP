import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { LucideIcon } from 'lucide-react';

export interface MobileTab {
  id: string;
  label: string;
  icon?: LucideIcon;
  content: React.ReactNode;
}

interface MobileTabsProps {
  tabs: MobileTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  enableSwipe?: boolean;
}

export const MobileTabs: React.FC<MobileTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  enableSwipe = true,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const { containerRef } = useSwipeNavigation({
    items: tabs.map((t) => t.id),
    currentItem: activeTab,
    onItemChange: onTabChange,
    enabled: enableSwipe,
  });

  // Auto-scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeButton = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      const scrollLeft =
        buttonRect.left -
        containerRect.left +
        container.scrollLeft -
        containerRect.width / 2 +
        buttonRect.width / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [activeTab]);

  const currentTabIndex = tabs.findIndex((t) => t.id === activeTab);
  const currentTab = tabs[currentTabIndex];

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Tab Headers */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide bg-muted/30 rounded-lg p-1 gap-1 min-h-[var(--touch-target)]"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md transition-all whitespace-nowrap min-h-[36px]',
                'active:scale-95',
                isActive
                  ? 'bg-background text-foreground shadow-sm font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Indicators */}
      <div className="flex justify-center gap-1.5 mt-3 mb-2">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'h-1.5 rounded-full transition-all',
              tab.id === activeTab
                ? 'w-6 bg-primary'
                : 'w-1.5 bg-muted-foreground/30'
            )}
            aria-label={`Go to ${tab.label}`}
          />
        ))}
      </div>

      {/* Tab Content */}
      <div ref={containerRef} className="mt-4">
        {currentTab?.content}
      </div>
    </div>
  );
};
