
import React from "react";
import { NotificationIndicator } from "@/components/notifications/NotificationIndicator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/useAuth";

export const NavbarRightContent = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-1">
      <ThemeToggle />
      <NotificationIndicator />
    </div>
  );
};
