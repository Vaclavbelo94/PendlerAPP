import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { WidgetConfig, DashboardLayout, WidgetSize } from './types';
import { DEFAULT_WIDGETS } from './WidgetRegistry';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';

const STORAGE_KEY = 'dashboard_layout';

interface DashboardLayoutManagerProps {
  children: (layout: WidgetConfig[], onReorder: (result: DropResult) => void) => React.ReactNode;
}

export const DashboardLayoutManager: React.FC<DashboardLayoutManagerProps> = ({ children }) => {
  const { isMobile } = useScreenOrientation();
  const [layout, setLayout] = useState<WidgetConfig[]>(DEFAULT_WIDGETS);

  // Load saved layout on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem(STORAGE_KEY);
    if (savedLayout) {
      try {
        const parsed: DashboardLayout = JSON.parse(savedLayout);
        setLayout(parsed.widgets.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error('Failed to parse saved layout:', error);
      }
    }
  }, []);

  // Save layout to localStorage
  const saveLayout = (newLayout: WidgetConfig[]) => {
    const layoutData: DashboardLayout = {
      widgets: newLayout,
      lastModified: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layoutData));
  };

  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(layout);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setLayout(updatedItems);
    saveLayout(updatedItems);

    // Haptic feedback on mobile
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // Reset to default layout
  const resetLayout = () => {
    setLayout(DEFAULT_WIDGETS);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Toggle widget visibility
  const toggleWidget = (widgetId: string) => {
    const updatedLayout = layout.map(widget =>
      widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
    );
    setLayout(updatedLayout);
    saveLayout(updatedLayout);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {children(layout.filter(widget => widget.visible), handleDragEnd)}
    </DragDropContext>
  );
};
