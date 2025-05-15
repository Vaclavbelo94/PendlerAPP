
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { ShiftType } from "./types";

// Format a shift date in a user-friendly format
export const formatShiftDate = (date: Date) => {
  return format(date, "EEEE, d. MMMM yyyy", { locale: cs });
};

// Get the time range for a shift type
export const getShiftTimeByType = (type: ShiftType) => {
  switch (type) {
    case "morning": return "Ranní (6:00 - 14:00)";
    case "afternoon": return "Odpolední (14:00 - 22:00)";
    case "night": return "Noční (22:00 - 6:00)";
  }
};

// Get the color class for a shift type
export const getShiftColor = (type: ShiftType) => {
  switch (type) {
    case "morning": return "bg-blue-500";
    case "afternoon": return "bg-green-500";
    case "night": return "bg-purple-500";
  }
};
