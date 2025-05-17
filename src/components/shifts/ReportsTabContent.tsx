
import React from "react";
import { MonthlyReport } from "./MonthlyReport";
import { ShiftAnalytics } from "./ShiftAnalytics";
import { ReportsTab } from "./ReportsTab";
import { Shift, AnalyticsPeriod } from "./types";

interface ReportsTabContentProps {
  shifts: Shift[];
  user: any;
  selectedMonth: Date;
  onSelectDate: (date: Date) => void;
  analyticsPeriod: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
}

export const ReportsTabContent: React.FC<ReportsTabContentProps> = ({
  shifts,
  user,
  selectedMonth,
  onSelectDate,
  analyticsPeriod,
  onPeriodChange
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <MonthlyReport 
            shifts={shifts}
            user={user}
            selectedMonth={selectedMonth}
            onSelectDate={onSelectDate}
          />
        </div>
        <div>
          <ShiftAnalytics 
            shifts={shifts} 
            period={analyticsPeriod}
            onPeriodChange={onPeriodChange}
          />
        </div>
      </div>
      <ReportsTab shifts={shifts} user={user} />
    </div>
  );
};
