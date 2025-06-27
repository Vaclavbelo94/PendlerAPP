
import React from "react";
import { NotificationIndicator } from "@/components/notifications/NotificationIndicator";
import { useAuth } from "@/hooks/auth";

export const NavbarRightContent = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-0.5 md:gap-1">
      <NotificationIndicator />
    </div>
  );
};
