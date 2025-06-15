
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { modernNavigationItems, getCategoryItems, getCategoryTitle } from './modernNavigationData';
import SidebarLogo from './SidebarLogo';
import SidebarUserSection from './SidebarUserSection';
import SidebarThemeSwitcher from './SidebarThemeSwitcher';

interface ModernSidebarProps {
  closeSidebar?: () => void;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({ closeSidebar }) => {
  const { user, isPremium, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['main', 'tools']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const isItemVisible = (item: any) => {
    if (item.isAdmin && !isAdmin) return false;
    if (item.isPremium && !isPremium && !item.isPublic) return false;
    if (item.requiresAuth && !user) return false;
    return true;
  };

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href) || location.pathname === href;
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    closeSidebar?.();
  };

  const categories = ['main', 'tools', 'settings', 'support', 'admin'];

  return (
    <div className="w-20 hover:w-64 group transition-all duration-300 bg-card border-r h-screen flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-4 border-b">
        <SidebarLogo closeSidebar={closeSidebar || (() => {})} />
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-2">
          {categories.map(category => {
            const categoryItems = getCategoryItems(category).filter(isItemVisible);
            if (categoryItems.length === 0) return null;

            const isExpanded = expandedCategories.includes(category);
            const categoryTitle = getCategoryTitle(category);

            return (
              <div key={category} className="space-y-1">
                {/* Category Header */}
                <Button
                  variant="ghost"
                  onClick={() => toggleCategory(category)}
                  className="w-full justify-between h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground group/header"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {categoryTitle}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </div>
                </Button>

                {/* Category Items */}
                {isExpanded && (
                  <div className="space-y-1 ml-1">
                    {categoryItems.map(item => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      
                      return (
                        <Button
                          key={item.id}
                          variant={active ? "secondary" : "ghost"}
                          onClick={() => handleNavigation(item.href)}
                          className={cn(
                            "w-full justify-start h-10 px-2 relative group/item transition-all duration-300",
                            active && "bg-primary/10 text-primary"
                          )}
                          title={item.label}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Icon className={cn(
                              "h-4 w-4 flex-shrink-0 transition-colors duration-300",
                              active ? "text-primary" : "text-muted-foreground"
                            )} />
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate text-sm font-medium">
                              {item.label}
                            </span>
                          </div>
                          
                          {item.isPremium && !isPremium && (
                            <Badge variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs">
                              Premium
                            </Badge>
                          )}
                          
                          {active && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                )}
                
                {category !== 'admin' && <Separator className="my-2" />}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-2 space-y-2">
        <SidebarThemeSwitcher />
        <SidebarUserSection closeSidebar={closeSidebar || (() => {})} />
      </div>
    </div>
  );
};
