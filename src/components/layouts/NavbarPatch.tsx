
import React from "react";
import { NotificationIndicator } from "@/components/notifications/NotificationIndicator";
import LanguageSwitcherCompact from "@/components/ui/LanguageSwitcherCompact";

export const NavbarRightContent = () => {
  return (
    <div className="flex items-center gap-2">
      <LanguageSwitcherCompact />
      <NotificationIndicator />
    </div>
  );
};
