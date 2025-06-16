
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 md:p-6 pointer-events-auto w-full max-w-none", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
        month: "space-y-4 md:space-y-6 w-full",
        caption: "flex justify-center pt-1 md:pt-2 relative items-center mb-4 md:mb-6",
        caption_label: "text-base md:text-lg font-semibold",
        nav: "space-x-1 md:space-x-2 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 md:h-10 md:w-10 bg-background p-0 opacity-80 hover:opacity-100 pointer-events-auto border shadow-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200"
        ),
        nav_button_previous: "absolute left-1 md:left-2",
        nav_button_next: "absolute right-1 md:right-2",
        table: "w-full border-collapse space-y-1 md:space-y-2",
        head_row: "flex justify-center w-full mb-2 md:mb-3",
        head_cell: "text-muted-foreground rounded-md w-full font-semibold text-sm md:text-base flex items-center justify-center flex-1 min-w-[40px] md:min-w-[50px] h-10 md:h-12",
        row: "flex w-full mt-2 md:mt-3 justify-center",
        cell: cn(
          "relative p-0 text-center text-sm md:text-base focus-within:relative focus-within:z-20",
          "flex-1 min-w-[40px] md:min-w-[50px] h-10 md:h-12",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected])]:bg-accent",
          "first:[&:has([aria-selected])]:rounded-l-md",
          "last:[&:has([aria-selected])]:rounded-r-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "w-full h-full p-0 font-medium aria-selected:opacity-100 flex items-center justify-center pointer-events-auto text-sm md:text-base",
          "hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
          "focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "cursor-pointer select-none"
        ),
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground font-bold border-2 border-primary/40",
        day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-30 pointer-events-none",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4 md:h-5 md:w-5" {...props} />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
