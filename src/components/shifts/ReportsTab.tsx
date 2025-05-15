
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Shift } from "./types";

interface ReportsTabProps {
  user: any;
  shifts: Shift[];
}

export const ReportsTab = ({ user, shifts }: ReportsTabProps) => {
  const navigate = useNavigate();
  
  // Handler for exporting PDF
  const handleExportPDF = () => {
    toast.success("Export do PDF byl zahájen. Soubor bude brzy ke stažení.");
  };

  return (
    <Card className="border-dhl-yellow">
      <CardHeader className="border-b border-dhl-yellow">
        <CardTitle>Přehled směn - {format(new Date(), "MMMM yyyy", { locale: cs })}</CardTitle>
        <CardDescription>Podrobný výpis směn</CardDescription>
      </CardHeader>
      <CardContent>
        {user ? (
          <div>
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Typ směny</TableHead>
                    <TableHead>Počet směn</TableHead>
                    <TableHead className="text-right">Celkem hodin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Ranní</TableCell>
                    <TableCell>{shifts.filter(s => s.type === "morning").length}</TableCell>
                    <TableCell className="text-right">{shifts.filter(s => s.type === "morning").length * 8}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Odpolední</TableCell>
                    <TableCell>{shifts.filter(s => s.type === "afternoon").length}</TableCell>
                    <TableCell className="text-right">{shifts.filter(s => s.type === "afternoon").length * 8}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Noční</TableCell>
                    <TableCell>{shifts.filter(s => s.type === "night").length}</TableCell>
                    <TableCell className="text-right">{shifts.filter(s => s.type === "night").length * 8}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Celkem</TableCell>
                    <TableCell>{shifts.length}</TableCell>
                    <TableCell className="text-right">{shifts.length * 8}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleExportPDF} className="bg-dhl-red text-white hover:bg-dhl-red/90">
                <Download className="mr-2 h-4 w-4" />
                Exportovat do PDF
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <Lock className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-muted-foreground mb-2">Přihlaste se pro zobrazení reportů směn</p>
            <Button 
              className="mt-2" 
              onClick={() => navigate("/login")}
              variant="default"
            >
              Přihlásit se
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
