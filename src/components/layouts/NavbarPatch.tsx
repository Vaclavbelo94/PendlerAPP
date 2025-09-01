
import React from "react";
import { UnifiedNotificationSystem } from "@/components/notifications/UnifiedNotificationSystem";
import LanguageSwitcherCompact from "@/components/ui/LanguageSwitcherCompact";

export const NavbarRightContent = () => {
  return (
    <div className="flex items-center gap-2">
      <LanguageSwitcherCompact />
      <UnifiedNotificationSystem />
    </div>
  );
};
