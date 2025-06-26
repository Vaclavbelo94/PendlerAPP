
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { dhlNavigationItems, dhlAdminNavigationItems } from "@/data/dhlNavigationData";
import { canAccessDHLAdmin } from "@/utils/dhlAuthUtils";
import { Truck } from "lucide-react";

export const DHLSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation('navigation');

  const isDHLAdmin = canAccessDHLAdmin(user);
  const currentNavigationItems = isDHLAdmin ? dhlAdminNavigationItems : dhlNavigationItems;

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full max-h-screen flex-col gap-2">
        {/* Logo */}
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/dhl-dashboard" className="flex items-center gap-2 font-semibold">
            <Truck className="h-6 w-6 text-yellow-600" />
            <span className="text-lg bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
              DHL Portal
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 p-2">
            <div className="pb-4">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-yellow-600">
                DHL Navigation
              </h2>
              <div className="space-y-1">
                {currentNavigationItems.map((item) => {
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
                        {item.title}
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
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="mt-auto border-t p-4">
          <div className="text-xs text-muted-foreground text-center">
            DHL Employee Portal
          </div>
        </div>
      </div>
    </div>
  );
};
