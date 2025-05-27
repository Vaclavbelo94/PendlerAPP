
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Shift } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getShiftColor, getShiftTimeByType, formatShiftDate } from "./utils";
import { dateFromDBString } from "./utils/dateUtils";

interface MonthlyReportProps {
  shifts: Shift[];
  user: any;
  selectedMonth: Date;
  onSelectDate: (date: Date) => void;
}

export const MonthlyReport = ({ shifts, user, selectedMonth, onSelectDate }: MonthlyReportProps) => {
  const navigate = useNavigate();
  
  return (
    <ScrollArea className="h-[400px]">
      {user ? (
        <div>
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Statistiky směn</h3>
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-blue-50">
                <CardContent className="py-4 px-3 text-center">
                  <p className="font-bold text-2xl text-blue-500">
                    {shifts.filter(s => s.type === "morning").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Ranní</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50">
                <CardContent className="py-4 px-3 text-center">
                  <p className="font-bold text-2xl text-green-500">
                    {shifts.filter(s => s.type === "afternoon").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Odpolední</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50">
                <CardContent className="py-4 px-3 text-center">
                  <p className="font-bold text-2xl text-purple-500">
                    {shifts.filter(s => s.type === "night").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Noční</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Table>
            <TableCaption>Přehled směn</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Typ směny</TableHead>
                <TableHead>Poznámka</TableHead>
                <TableHead className="text-right">Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Zatím nemáte naplánované žádné směny
                  </TableCell>
                </TableRow>
              ) : (
                shifts.map((shift, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatShiftDate(shift.date)}</TableCell>
                    <TableCell>
                      <Badge className={`${getShiftColor(shift.type)} text-white`}>
                        {getShiftTimeByType(shift.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {shift.notes ? (
                        <div className="truncate max-w-[200px]" title={shift.notes}>
                          {shift.notes}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const dateObj = dateFromDBString(shift.date);
                          onSelectDate(dateObj);
                        }}
                      >
                        Zobrazit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <Lock className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-muted-foreground mb-2">Přihlaste se pro zobrazení statistik a přehledu směn</p>
          <Button 
            className="mt-2" 
            onClick={() => navigate("/login")}
            variant="default"
          >
            Přihlásit se
          </Button>
        </div>
      )}
    </ScrollArea>
  );
};
