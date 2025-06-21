
import React from "react";
import { NotificationIndicator } from "@/components/notifications/NotificationIndicator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import ShiftNotificationDialog from "@/components/notifications/ShiftNotificationDialog";
import ScheduleShareDialog from "@/components/sharing/ScheduleShareDialog";
import LanguageToggle from "@/components/common/LanguageToggle";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

export const NavbarRightContent = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {/* Language toggle for all users */}
      <LanguageToggle />
      
      {/* Theme toggle - hidden on mobile due to component styling */}
      <ThemeToggle />
      
      {user && (
        <>
          <ShiftNotificationDialog />
          <ScheduleShareDialog />
        </>
      )}
      
      <NotificationIndicator />
    </div>
  );
};
