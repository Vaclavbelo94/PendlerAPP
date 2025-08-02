import React from 'react';
import * as Icons from 'lucide-react';
import { MenuSection } from '@/hooks/useMobileMenuData';

interface MobileMenuContentProps {
  menuSections: MenuSection[];
  isLoading: boolean;
  onNavigate: (href: string) => void;
}

export const MobileMenuContent: React.FC<MobileMenuContentProps> = ({
  menuSections,
  isLoading,
  onNavigate
}) => {
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? IconComponent : Icons.Circle;
  };

  // Group items into pairs for 2x2 grid
  const getGroupedItems = (items: any[]) => {
    const pairs = [];
    for (let i = 0; i < items.length; i += 2) {
      pairs.push(items.slice(i, i + 2));
    }
    return pairs;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {section.title}
          </h3>
          
          {/* 2x2 Grid Layout */}
          <div className="space-y-3">
            {getGroupedItems(section.items).map((pair, pairIndex) => (
              <div key={pairIndex} className="grid grid-cols-2 gap-3">
                {pair.map((item) => {
                  const IconComponent = getIcon(item.icon);
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.route)}
                      className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-left group"
                    >
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm leading-tight">{item.title}</h4>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}

      {menuSections.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <p>Žádné menu položky nejsou dostupné</p>
        </div>
      )}
    </div>
  );
};