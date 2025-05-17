
import React from "react";
import { Card } from "@/components/ui/card";
import { ShiftCalendar } from "./ShiftCalendar";
import { ShiftDetails } from "./ShiftDetails";
import { Shift } from "./types";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ShiftCalendarTabProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  shifts: Shift[];
  currentShift: Shift | null;
  shiftType: import("./types").ShiftType;
  setShiftType: (type: import("./types").ShiftType) => void;
  shiftNotes: string;
  setShiftNotes: (notes: string) => void;
  user: any;
  onSaveShift: () => void;
  onDeleteShift: () => void;
  onOpenNoteDialog: () => void;
}

export const ShiftCalendarTab: React.FC<ShiftCalendarTabProps> = ({
  selectedDate,
  onSelectDate,
  shifts,
  currentShift,
  shiftType,
  setShiftType,
  shiftNotes,
  setShiftNotes,
  user,
  onSaveShift,
  onDeleteShift,
  onOpenNoteDialog
}) => {
  const isTablet = useMediaQuery("md");

  return (
    <div className={`grid ${isTablet ? "grid-cols-2" : "grid-cols-1"} gap-6`}>
      <Card className="p-4">
        <ShiftCalendar 
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          shifts={shifts}
        />
      </Card>
      
      <Card className="p-4">
        <ShiftDetails 
          selectedDate={selectedDate}
          currentShift={currentShift}
          shiftType={shiftType}
          setShiftType={setShiftType}
          shiftNotes={shiftNotes}
          setShiftNotes={setShiftNotes}
          user={user}
          onSaveShift={onSaveShift}
          onDeleteShift={onDeleteShift}
          onOpenNoteDialog={onOpenNoteDialog}
        />
      </Card>
    </div>
  );
};
