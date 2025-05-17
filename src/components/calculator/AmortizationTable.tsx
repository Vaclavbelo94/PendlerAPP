
import React, { useState } from 'react';
import { AmortizationRow } from '@/hooks/useAmortizationSchedule';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface AmortizationTableProps {
  schedule: AmortizationRow[];
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({ schedule }) => {
  const isMobile = useMediaQuery("xs");
  
  // For mobile devices, limit the initial display to 3 rows
  const [displayCount, setDisplayCount] = useState<number>(isMobile ? 3 : 12);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [filterPeriod, setFilterPeriod] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Filter schedule based on search criteria
  const filteredSchedule = schedule.filter(row => {
    if (!filterPeriod) return true;
    return row.period.toString().includes(filterPeriod);
  });
  
  const displayedSchedule = showAll 
    ? filteredSchedule 
    : filteredSchedule.slice(0, displayCount);
  
  const handleShowMore = () => {
    if (showAll) {
      setShowAll(false);
    } else {
      if (displayCount < filteredSchedule.length) {
        if (displayCount + 12 >= filteredSchedule.length) {
          setShowAll(true);
        } else {
          setDisplayCount(displayCount + 12);
        }
      }
    }
  };
  
  const calculateTotalInterest = () => {
    return schedule.reduce((total, row) => total + row.interest, 0);
  };
  
  const calculateTotalPayment = () => {
    return schedule.reduce((total, row) => total + row.payment, 0);
  };
  
  return (
    <div>
      <div className="mb-4 flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">Počet splátek: {schedule.length}</div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filtrovat
          </Button>
        </div>
        
        {showFilters && (
          <div className="pt-2 pb-1">
            <div className="space-y-2">
              <Label htmlFor="filterPeriod" className="text-xs">Filtrovat podle období</Label>
              <Input
                id="filterPeriod"
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                placeholder="Zadejte číslo období..."
                className="h-8 text-sm"
              />
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 bg-muted/50 p-2 rounded-md text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Celková platba:</span>
            <span className="font-medium">{calculateTotalPayment().toFixed(2)} Kč</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Celkový úrok:</span>
            <span className="font-medium">{calculateTotalInterest().toFixed(2)} Kč</span>
          </div>
        </div>
      </div>
      
      <div className="rounded-md border max-h-[500px] overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted border-b">
                <th className="py-2 px-3 font-medium text-left">Období</th>
                <th className="py-2 px-3 font-medium text-right">Splátka</th>
                <th className="py-2 px-3 font-medium text-right">Jistina</th>
                <th className="py-2 px-3 font-medium text-right">Úrok</th>
                <th className="py-2 px-3 font-medium text-right">Zůstatek</th>
              </tr>
            </thead>
            <tbody>
              {displayedSchedule.length > 0 ? (
                displayedSchedule.map((row) => (
                  <tr key={row.period} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-3">{row.period}</td>
                    <td className="py-2 px-3 text-right">{row.payment.toFixed(2)} Kč</td>
                    <td className="py-2 px-3 text-right">{row.principal.toFixed(2)} Kč</td>
                    <td className="py-2 px-3 text-right">{row.interest.toFixed(2)} Kč</td>
                    <td className="py-2 px-3 text-right">{row.remainingBalance.toFixed(2)} Kč</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-muted-foreground">
                    Žádné výsledky nenalezeny
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {!showAll && filteredSchedule.length > displayCount && (
          <div className="p-2 text-center">
            <button 
              onClick={handleShowMore}
              className="text-sm text-primary hover:underline flex items-center justify-center w-full"
            >
              <ChevronDown className="h-4 w-4 mr-1" />
              Zobrazit více...
            </button>
          </div>
        )}
        
        {showAll && filteredSchedule.length > 12 && (
          <div className="p-2 text-center">
            <button 
              onClick={handleShowMore}
              className="text-sm text-primary hover:underline flex items-center justify-center w-full"
            >
              <ChevronUp className="h-4 w-4 mr-1" />
              Zobrazit méně
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmortizationTable;
