
import { useState } from "react";
import { CalendarIcon, Download, FileDown } from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface ExportPdfDialogProps {
  user: any;
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
}

export const ExportPdfDialog = ({ 
  user, 
  selectedMonth, 
  setSelectedMonth 
}: ExportPdfDialogProps) => {
  const handleExportPDF = () => {
    toast.success("Export do PDF byl zahájen. Soubor bude brzy ke stažení.");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full border-dhl-red text-dhl-red hover:bg-dhl-red/10"
          disabled={!user}
        >
          <FileDown className="mr-2" />
          Exportovat přehled směn do PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exportovat směny do PDF</DialogTitle>
          <DialogDescription>
            Vyberte měsíc, pro který chcete exportovat přehled směn.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
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
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleExportPDF} className="bg-dhl-red hover:bg-dhl-red/90">
            <Download className="mr-2 h-4 w-4" />
            Exportovat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
