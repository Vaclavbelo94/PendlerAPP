import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const DataStatsOverview = ({ stats }: { stats: any }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <div>
              <span className="font-semibold">Směny</span>
              <span className="block text-muted-foreground">{stats.shiftsCount} záznamů</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataStatsOverview;
