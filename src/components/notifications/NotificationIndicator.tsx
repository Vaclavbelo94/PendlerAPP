
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NotificationIndicator = () => {
  return (
    <Button variant="ghost" size="sm" className="relative">
      <Bell className="w-4 h-4" />
      {/* Notification dot - uncomment when needed */}
      {/* <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div> */}
    </Button>
  );
};
