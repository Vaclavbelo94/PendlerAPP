
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, FilterX, ArrowUpDown } from "lucide-react";
import { PromoCodeBreakdown } from "../types";
import { formatDate } from "../promoCodeUtils";

interface PromoCodeBreakdownTableProps {
  data: PromoCodeBreakdown[];
}

type SortKey = "code" | "discount" | "usedCount" | "validUntil" | "redemptionRate";
type SortOrder = "asc" | "desc";

export const PromoCodeBreakdownTable = ({ data }: PromoCodeBreakdownTableProps) => {
  const [filteredData, setFilteredData] = useState<PromoCodeBreakdown[]>(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("usedCount");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredData(data);
      return;
    }
    
    const filtered = data.filter(item => 
      item.code.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSort = (key: SortKey) => {
    const isAsc = sortKey === key && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortKey(key);
    
    const sorted = [...filteredData].sort((a, b) => {
      let comparison = 0;
      
      if (key === "redemptionRate") {
        const rateA = a.maxUses ? (a.usedCount / a.maxUses) : a.usedCount;
        const rateB = b.maxUses ? (b.usedCount / b.maxUses) : b.usedCount;
        comparison = rateA - rateB;
      } else if (key === "validUntil") {
        comparison = new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime();
      } else {
        // @ts-ignore - We know these properties exist
        comparison = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
      }
      
      return isAsc ? comparison * -1 : comparison;
    });
    
    setFilteredData(sorted);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilteredData(data);
    setSortKey("usedCount");
    setSortOrder("desc");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Input
            placeholder="Hledat podle kódu..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-3 pr-8"
          />
          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={resetFilters}
            >
              <FilterX className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <span>Kód</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleSort("code")}>
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <span>Sleva</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleSort("discount")}>
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <span>Použito</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleSort("usedCount")}>
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <span>Platnost do</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleSort("validUntil")}>
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </div>
              </TableHead>
              <TableHead>Použití / Max</TableHead>
              <TableHead className="text-right">Akce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.code}</TableCell>
                  <TableCell>{item.discount}%</TableCell>
                  <TableCell>{item.usedCount}×</TableCell>
                  <TableCell>
                    <span 
                      className={`${new Date(item.validUntil) < new Date() ? 'text-red-500' : ''}`}
                    >
                      {formatDate(item.validUntil)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="bg-muted w-full h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full" 
                          style={{ 
                            width: `${item.maxUses ? Math.min(100, (item.usedCount / item.maxUses) * 100) : Math.min(100, item.usedCount * 5)}%` 
                          }}
                        />
                      </div>
                      <span className="text-xs whitespace-nowrap">
                        {item.usedCount} / {item.maxUses || "∞"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Zobrazit detail</DropdownMenuItem>
                        <DropdownMenuItem>Zobrazit použití</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Deaktivovat</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  {searchTerm ? "Žádné kódy neodpovídají vyhledávání" : "Žádné promo kódy k zobrazení"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
