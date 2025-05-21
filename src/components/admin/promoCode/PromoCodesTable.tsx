
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PromoCode } from "./types";

interface PromoCodesTableProps {
  promoCodes: PromoCode[];
  onResetUsage: (id: string) => void;
  onExtendValidity: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PromoCodesTable = ({
  promoCodes,
  onResetUsage,
  onExtendValidity,
  onDelete,
}: PromoCodesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kód</TableHead>
          <TableHead>Sleva</TableHead>
          <TableHead>Trvání</TableHead>
          <TableHead>Platnost do</TableHead>
          <TableHead>Použito / Max</TableHead>
          <TableHead className="text-right">Akce</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {promoCodes.map((code) => (
          <TableRow key={code.id}>
            <TableCell className="font-medium">{code.code}</TableCell>
            <TableCell>{code.discount}%</TableCell>
            <TableCell>{code.duration} {code.duration === 1 ? 'měsíc' : code.duration < 5 ? 'měsíce' : 'měsíců'}</TableCell>
            <TableCell>{new Date(code.validUntil).toLocaleDateString()}</TableCell>
            <TableCell>
              {code.usedCount} / {code.maxUses === null ? "∞" : code.maxUses}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onResetUsage(code.id)}
              >
                Reset
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onExtendValidity(code.id)}
              >
                Prodloužit
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onDelete(code.id)}
              >
                Smazat
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
