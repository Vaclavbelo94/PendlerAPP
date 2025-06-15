
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const DataStatsOverview = ({ stats }: { stats: any }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <div>
              <span className="font-semibold">Slovíčka</span>
              <span className="block text-muted-foreground">
                {stats.vocabularyCount?.toLocaleString?.('cs-CZ') ?? '0'} položek
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div>
              <span className="font-semibold">Směny</span>
              <span className="block text-muted-foreground">
                {stats.shiftsCount?.toLocaleString?.('cs-CZ') ?? '0'} záznamů
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataStatsOverview;
