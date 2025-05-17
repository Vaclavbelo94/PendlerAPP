
import React from "react";
import { NotificationIndicator } from "@/components/notifications/NotificationIndicator";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const NavbarRightContent = () => {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <NotificationIndicator />
    </div>
  );
};
