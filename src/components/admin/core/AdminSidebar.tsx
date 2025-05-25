
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Database,
  FileText,
  Activity,
  Key,
  Crown,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAdminContext } from './AdminProvider';
import { cn } from '@/lib/utils';

interface AdminMenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge?: number;
  children?: AdminMenuItem[];
}

const menuItems: AdminMenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    id: 'users',
    title: 'Správa uživatelů',
    icon: <Users className="h-5 w-5" />,
    children: [
      { id: 'users-list', title: 'Seznam uživatelů', icon: <Users className="h-4 w-4" /> },
      { id: 'users-roles', title: 'Role a oprávnění', icon: <Shield className="h-4 w-4" /> },
      { id: 'users-activity', title: 'Aktivita uživatelů', icon: <Activity className="h-4 w-4" /> }
    ]
  },
  {
    id: 'content',
    title: 'Správa obsahu',
    icon: <FileText className="h-5 w-5" />,
    children: [
      { id: 'promo-codes', title: 'Promo kódy', icon: <Key className="h-4 w-4" /> },
      { id: 'premium-features', title: 'Premium funkce', icon: <Crown className="h-4 w-4" /> }
    ]
  },
  {
    id: 'system',
    title: 'Systém',
    icon: <Settings className="h-5 w-5" />,
    children: [
      { id: 'system-logs', title: 'Systémové logy', icon: <FileText className="h-4 w-4" /> },
      { id: 'system-monitoring', title: 'Monitoring', icon: <Activity className="h-4 w-4" /> },
      { id: 'database', title: 'Databáze', icon: <Database className="h-4 w-4" /> }
    ]
  }
];

export const AdminSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['users']);
  const { currentSection, setCurrentSection } = useAdminContext();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (itemId: string, hasChildren: boolean) => {
    if (hasChildren) {
      toggleExpanded(itemId);
    } else {
      setCurrentSection(itemId);
      setIsOpen(false); // Zavřít sidebar na mobilu
    }
  };

  const renderMenuItem = (item: AdminMenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = currentSection === item.id;

    return (
      <div key={item.id}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start h-auto p-3",
            level > 0 && "ml-4 pl-8",
            isActive && "bg-primary/10 text-primary"
          )}
          onClick={() => handleItemClick(item.id, hasChildren)}
        >
          <div className="flex items-center gap-3 flex-1">
            {item.icon}
            <span className="text-sm font-medium">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          {hasChildren && (
            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Pendler App</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-6">
            <nav className="space-y-2">
              {menuItems.map(item => renderMenuItem(item))}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground text-center">
              Admin Panel v1.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
