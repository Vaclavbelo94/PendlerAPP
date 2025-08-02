import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  Shield, 
  BarChart3, 
  Database,
  Activity
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAdminV2 } from '@/hooks/useAdminV2';

const adminMenuItems = [
  {
    title: 'Dashboard',
    url: '/admin/v2',
    icon: LayoutDashboard,
    requiredPermission: 'viewer' as const,
  },
  {
    title: 'Správa účtů',
    url: '/admin/v2/accounts',
    icon: Users,
    requiredPermission: 'moderator' as const,
  },
  {
    title: 'Správa firem',
    url: '/admin/v2/companies',
    icon: Building2,
    requiredPermission: 'admin' as const,
  },
  {
    title: 'Nastavení webu',
    url: '/admin/v2/settings',
    icon: Settings,
    requiredPermission: 'admin' as const,
  },
  {
    title: 'Bezpečnost',
    url: '/admin/v2/security',
    icon: Shield,
    requiredPermission: 'super_admin' as const,
  },
  {
    title: 'Analytics',
    url: '/admin/v2/analytics',
    icon: BarChart3,
    requiredPermission: 'admin' as const,
  },
  {
    title: 'Databáze',
    url: '/admin/v2/database',
    icon: Database,
    requiredPermission: 'super_admin' as const,
  },
  {
    title: 'Monitoring',
    url: '/admin/v2/monitoring',
    icon: Activity,
    requiredPermission: 'admin' as const,
  },
];

export const AdminSidebarV2: React.FC = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const { adminPermissions, hasPermission } = useAdminV2();

  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => {
    if (path === '/admin/v2') {
      return currentPath === '/admin/v2';
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (isActive: boolean) =>
    isActive
      ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary'
      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground';

  const visibleMenuItems = adminMenuItems.filter(item =>
    hasPermission(item.requiredPermission)
  );

  return (
    <Sidebar className={`border-r ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          {!isCollapsed && (
            <>
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h2 className="font-semibold text-sm">Admin Panel V2</h2>
                <Badge variant="outline" className="text-xs">
                  {adminPermissions?.permission_level}
                </Badge>
              </div>
            </>
          )}
          {isCollapsed && <Shield className="h-6 w-6 text-primary mx-auto" />}
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administrace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavClassName(isActive(item.url))}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Trigger for mobile */}
      <div className="p-2 border-t">
        <SidebarTrigger className="w-full" />
      </div>
    </Sidebar>
  );
};