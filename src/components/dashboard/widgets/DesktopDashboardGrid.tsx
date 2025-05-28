
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical } from 'lucide-react';
import { WidgetConfig } from './types';
import DashboardCard from '../DashboardCard';
import { getWidgetComponent } from './WidgetRegistry';

interface DesktopDashboardGridProps {
  widgets: WidgetConfig[];
}

export const DesktopDashboardGrid: React.FC<DesktopDashboardGridProps> = ({ widgets }) => {
  const getGridClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'lg:col-span-2';
      case 'medium':
        return 'md:col-span-1';
      case 'small':
        return 'md:col-span-1 lg:col-span-1';
      default:
        return 'md:col-span-1';
    }
  };

  return (
    <Droppable droppableId="dashboard" direction="horizontal">
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
            snapshot.isDraggingOver ? 'bg-accent/20 rounded-lg' : ''
          }`}
        >
          {widgets.map((widget, index) => {
            const WidgetComponent = getWidgetComponent(widget.type);
            
            return (
              <Draggable key={widget.id} draggableId={widget.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`${getGridClasses(widget.size)} ${
                      snapshot.isDragging ? 'z-50 rotate-2 scale-105' : ''
                    }`}
                  >
                    <DashboardCard
                      title={widget.title}
                      description={widget.description}
                      index={index}
                      className={`relative group transition-all duration-200 ${
                        snapshot.isDragging ? 'shadow-2xl' : ''
                      }`}
                    >
                      {/* Drag handle */}
                      <div
                        {...provided.dragHandleProps}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <WidgetComponent />
                    </DashboardCard>
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
