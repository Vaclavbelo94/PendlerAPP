
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MonthSelectorProps {
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
}

export const MonthSelector = ({ selectedMonth, setSelectedMonth }: MonthSelectorProps) => {
  return (
    <div>
      <Label htmlFor="month">Měsíc</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="month"
            variant={"outline"}
            className="w-full justify-start text-left font-normal mt-1"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedMonth ? (
              format(selectedMonth, "MMMM yyyy", { locale: cs })
            ) : (
              <span>Vyberte měsíc</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedMonth}
            onSelect={(date) => date && setSelectedMonth(date)}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
            locale={cs}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
