
import React from 'react';
import { AmortizationRow } from '@/hooks/useAmortizationSchedule';
import { useMediaQuery } from '@/hooks/use-media-query';

interface AmortizationTableProps {
  schedule: AmortizationRow[];
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({ schedule }) => {
  const isMobile = useMediaQuery("xs");
  
  // For mobile devices, limit the initial display to 3 rows
  const [displayCount, setDisplayCount] = React.useState(isMobile ? 3 : 12);
  const [showAll, setShowAll] = React.useState(false);
  
  const displayedSchedule = showAll ? schedule : schedule.slice(0, displayCount);
  
  const handleShowMore = () => {
    if (showAll) {
      setShowAll(false);
    } else {
      if (displayCount < schedule.length) {
        if (displayCount + 12 >= schedule.length) {
          setShowAll(true);
        } else {
          setDisplayCount(displayCount + 12);
        }
      }
    }
  };
  
  return (
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
            {displayedSchedule.map((row) => (
              <tr key={row.period} className="border-b hover:bg-muted/50">
                <td className="py-2 px-3">{row.period}</td>
                <td className="py-2 px-3 text-right">{row.payment.toFixed(2)} Kč</td>
                <td className="py-2 px-3 text-right">{row.principal.toFixed(2)} Kč</td>
                <td className="py-2 px-3 text-right">{row.interest.toFixed(2)} Kč</td>
                <td className="py-2 px-3 text-right">{row.remainingBalance.toFixed(2)} Kč</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {!showAll && schedule.length > displayCount && (
        <div className="p-2 text-center">
          <button 
            onClick={handleShowMore}
            className="text-sm text-primary hover:underline"
          >
            Zobrazit více...
          </button>
        </div>
      )}
      
      {showAll && (
        <div className="p-2 text-center">
          <button 
            onClick={handleShowMore}
            className="text-sm text-primary hover:underline"
          >
            Zobrazit méně
          </button>
        </div>
      )}
    </div>
  );
};

export default AmortizationTable;
