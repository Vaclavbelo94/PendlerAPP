
import React from "react";
import { NotificationIndicator } from "@/components/notifications/NotificationIndicator";

export const NavbarRightContent = () => {
  return (
    <div className="flex items-center gap-2">
      <NotificationIndicator />
    </div>
  );
};
