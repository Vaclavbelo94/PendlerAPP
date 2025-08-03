
import React from "react";
import { CompactNotificationIndicator } from "@/components/notifications/CompactNotificationIndicator";
import LanguageSwitcherCompact from "@/components/ui/LanguageSwitcherCompact";

export const NavbarRightContent = () => {
  return (
    <div className="flex items-center gap-2">
      <LanguageSwitcherCompact />
      <CompactNotificationIndicator />
    </div>
  );
};
