
import { useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ExportDialogContent } from "./components/ExportDialogContent";

interface ExportPdfDialogProps {
  user: any;
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ExportPdfDialog = ({ 
  user, 
  selectedMonth, 
  setSelectedMonth,
  open,
  onOpenChange
}: ExportPdfDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Use controlled or uncontrolled dialog state
  const dialogOpen = open !== undefined ? open : isDialogOpen;
  const setDialogOpen = onOpenChange || setIsDialogOpen;

  // If using the controlled dialog pattern
  if (open !== undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <ExportDialogContent 
          user={user} 
          selectedMonth={selectedMonth} 
          setSelectedMonth={setSelectedMonth} 
          onClose={() => setDialogOpen(false)}
        />
      </Dialog>
    );
  }

  // Original implementation with trigger button
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
      <ExportDialogContent 
        user={user} 
        selectedMonth={selectedMonth} 
        setSelectedMonth={setSelectedMonth} 
        onClose={() => setDialogOpen(false)}
      />
    </Dialog>
  );
};
