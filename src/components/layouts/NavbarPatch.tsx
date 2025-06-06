
import React from "react";
import { NotificationIndicator } from "@/components/notifications/NotificationIndicator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import ShiftNotificationDialog from "@/components/notifications/ShiftNotificationDialog";
import ScheduleShareDialog from "@/components/sharing/ScheduleShareDialog";
import LanguageToggle from "@/components/common/LanguageToggle";
import { useAuth } from "@/hooks/useAuth";

export const NavbarRightContent = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {/* Language toggle for all users */}
      <LanguageToggle />
      
      {/* Na mobilních zařízeních se nezobrazí díky úpravě ThemeToggle komponenty */}
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
