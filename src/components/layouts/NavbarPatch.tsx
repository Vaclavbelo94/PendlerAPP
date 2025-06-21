
import React from "react";
import { NotificationIndicator } from "@/components/notifications/NotificationIndicator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import ShiftNotificationDialog from "@/components/notifications/ShiftNotificationDialog";
import ScheduleShareDialog from "@/components/sharing/ScheduleShareDialog";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Bell, Share } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export const NavbarRightContent = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-1">
      <ThemeToggle />
      
      {user && (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Nastavit notifikace</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ShiftNotificationDialog />
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Share className="h-4 w-4" />
                <span className="sr-only">Sdílet rozvrh</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ScheduleShareDialog />
            </DialogContent>
          </Dialog>
        </>
      )}
      
      <NotificationIndicator />
    </div>
  );
};
