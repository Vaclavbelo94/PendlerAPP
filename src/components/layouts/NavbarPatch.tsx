
import React from "react";
import { UnifiedNotificationCenter } from "@/components/notifications/UnifiedNotificationCenter";
import LanguageSwitcherCompact from "@/components/ui/LanguageSwitcherCompact";

export const NavbarRightContent = () => {
  return (
    <div className="flex items-center gap-2">
      <LanguageSwitcherCompact />
      <UnifiedNotificationCenter />
    </div>
  );
};
