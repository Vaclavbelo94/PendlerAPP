
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { ShiftDashboardWidget } from "@/components/shifts/dashboard/ShiftDashboardWidget";
import { useShiftsData } from "@/hooks/shifts/useShiftsData";

const ScheduleWidget = () => {
  const { user } = useAuth();
  const { shifts, isLoading } = useShiftsData({ userId: user?.id });
  
  if (!user) {
    // Mock schedule for demo purposes when not logged in
    const schedule = [
      { day: 'Pondělí', time: '6:00 - 14:00', type: 'Ranní' },
      { day: 'Středa', time: '14:00 - 22:00', type: 'Odpolední' },
      { day: 'Čtvrtek', time: '14:00 - 22:00', type: 'Odpolední' },
      { day: 'Sobota', time: '22:00 - 6:00', type: 'Noční' }
    ];
    
    return (
      <div>
        <div className="space-y-3">
          {schedule.map((shift, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium">{shift.day}</div>
                <div className="text-sm text-muted-foreground">{shift.time}</div>
              </div>
              <div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  shift.type === 'Ranní' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                  shift.type === 'Odpolední' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                }`}>
                  {shift.type}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4">
          <Button variant="outline" size="sm" className="w-full">
            Zobrazit celý rozpis
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-muted/50 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return <ShiftDashboardWidget shifts={shifts} />;
};

export default ScheduleWidget;
