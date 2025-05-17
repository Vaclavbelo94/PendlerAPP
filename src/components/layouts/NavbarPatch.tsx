
import React from "react";
import { NotificationIndicator } from "@/components/notifications/NotificationIndicator";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const NavbarRightContent = () => {
  return (
    <div className="flex items-center gap-2">
      {/* Na mobilních zařízeních se nezobrazí díky úpravě ThemeToggle komponenty */}
      <ThemeToggle />
      <NotificationIndicator />
    </div>
  );
};
