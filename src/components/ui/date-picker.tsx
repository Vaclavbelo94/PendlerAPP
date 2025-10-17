
import * as React from "react"
import { format } from "date-fns"
import { cs, de, pl } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { useTranslation } from 'react-i18next'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  selected?: Date | null
  onSelect?: (date: Date | undefined) => void
  placeholderText?: string
  disabled?: boolean
  className?: string
}

export function DatePicker({
  selected,
  onSelect,
  placeholderText,
  disabled = false,
  className
}: DatePickerProps) {
  const { t, i18n } = useTranslation();
  
  // Get locale for date formatting
  const getLocale = () => {
    switch (i18n.language) {
      case 'de':
        return de;
      case 'pl':
        return pl;
      case 'cs':
      default:
        return cs;
    }
  };

  const getPlaceholder = () => {
    if (placeholderText) return placeholderText;
    return t('common:selectDate', 'Vyberte datum');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full min-h-[var(--touch-target-min)] justify-start text-left font-normal text-base md:text-sm",
            !selected && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-5 w-5 md:h-4 md:w-4" />
          {selected ? format(selected, "PPP", { locale: getLocale() }) : <span>{getPlaceholder()}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected || undefined}
          onSelect={onSelect}
          initialFocus
          className={cn(
            "p-3 pointer-events-auto",
            "[&_button]:min-h-[var(--touch-target-min)] [&_button]:min-w-[var(--touch-target-min)]",
            "[&_button]:text-base md:[&_button]:text-sm"
          )}
        />
      </PopoverContent>
    </Popover>
  )
}
