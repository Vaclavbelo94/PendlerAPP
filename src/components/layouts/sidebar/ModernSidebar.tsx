
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useDHLAuth } from "@/hooks/useDHLAuth";
import { useTranslation } from "react-i18next";
import SidebarLogo from "./SidebarLogo";
import SidebarUserSection from "./SidebarUserSection";
import SidebarThemeSwitcher from "./SidebarThemeSwitcher";
import { navigationItems } from "@/data/navigationData";

const ModernSidebar = () => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { canAccessDHLAdmin, canAccessDHLFeatures } = useDHLAuth();
  const { t } = useTranslation('common');

  const filteredNavigationItems = navigationItems.filter(item => {
    // Regular admin check
    if (item.adminOnly && !isAdmin) return false;
    
    // DHL admin check
    if (item.dhlAdminOnly && !canAccessDHLAdmin) return false;
    
    // DHL employee check
    if (item.dhlOnly && !canAccessDHLFeatures) return false;
    
    return true;
  });

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full max-h-screen flex-col gap-2">
        {/* Logo */}
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <SidebarLogo closeSidebar={() => {}} />
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 p-2">
            {/* Main Navigation */}
            <div className="pb-4">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {t('navigation')}
              </h2>
              <div className="space-y-1">
                {filteredNavigationItems
                  .filter(item => !item.adminOnly && !item.dhlAdminOnly && !item.dhlOnly)
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.path}
                        asChild
                        variant={location.pathname === item.path ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          location.pathname === item.path && "bg-muted font-medium"
                        )}
                      >
                        <Link to={item.path}>
                          <Icon className="mr-2 h-4 w-4" />
                          {t(item.titleKey)}
                          {item.badge && (
                            <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </Button>
                    );
                  })}
              </div>
            </div>

            {/* DHL Section */}
            {canAccessDHLFeatures && (
              <>
                <Separator />
                <div className="pb-4">
                  <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-yellow-600">
                    DHL
                  </h2>
                  <div className="space-y-1">
                    {filteredNavigationItems
                      .filter(item => item.dhlOnly || item.dhlAdminOnly)
                      .map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.path}
                            asChild
                            variant={location.pathname === item.path ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start",
                              location.pathname === item.path && "bg-muted font-medium"
                            )}
                          >
                            <Link to={item.path}>
                              <Icon className="mr-2 h-4 w-4" />
                              {item.dhlAdminOnly ? 'DHL Admin' : 'DHL Dashboard'}
                              {item.badge && (
                                <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          </Button>
                        );
                      })}
                  </div>
                </div>
              </>
            )}

            {/* Admin Section */}
            {isAdmin && (
              <>
                <Separator />
                <div className="pb-4">
                  <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-red-600">
                    {t('administration')}
                  </h2>
                  <div className="space-y-1">
                    {filteredNavigationItems
                      .filter(item => item.adminOnly && !item.dhlAdminOnly)
                      .map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.path}
                            asChild
                            variant={location.pathname === item.path ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start",
                              location.pathname === item.path && "bg-muted font-medium"
                            )}
                          >
                            <Link to={item.path}>
                              <Icon className="mr-2 h-4 w-4" />
                              {t(item.titleKey)}
                              {item.badge && (
                                <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          </Button>
                        );
                      })}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="mt-auto border-t p-4">
          <SidebarThemeSwitcher />
          <SidebarUserSection collapsed={false} />
        </div>
      </div>
    </div>
  );
};

export default ModernSidebar;
