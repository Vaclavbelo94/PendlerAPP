
import React from "react";
import { CompactNotificationIndicator } from "@/components/notifications/CompactNotificationIndicator";
import { MobileNotificationTrigger } from "@/components/mobile/MobileNotificationTrigger";
import LanguageSwitcherCompact from "@/components/ui/LanguageSwitcherCompact";
import { useIsMobile } from "@/hooks/use-mobile";

export const NavbarRightContent = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center gap-2">
      <LanguageSwitcherCompact />
      {isMobile ? (
        <MobileNotificationTrigger />
      ) : (
        <CompactNotificationIndicator />
      )}
    </div>
  );
};
