
import React from "react";
import DashboardCard from "../DashboardCard";
import WordsChart from "../WordsChart";
import ShiftsProgress from "../ShiftsProgress";
import CommuteComparison from "../CommuteComparison";

interface OverviewTabProps {
  isLoading?: boolean;
}

const OverviewTab = ({ isLoading = false }: OverviewTabProps) => {
  if (isLoading) {
    return null; // Loading state is handled by the parent
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Učení slovíček"
        description="Posledních 7 dní"
        index={0}
      >
        <WordsChart />
      </DashboardCard>

      <DashboardCard
        title="Pracovní směny"
        description="Odpracované hodiny"
        index={1}
      >
        <ShiftsProgress />
      </DashboardCard>

      <DashboardCard
        title="Dojíždění"
        description="Tento měsíc vs. minulý měsíc"
        index={2}
      >
        <CommuteComparison />
      </DashboardCard>
    </div>
  );
};

export default OverviewTab;
