
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LanguageStatsWidget from "../LanguageStatsWidget";

interface LanguageTabProps {
  isLoading: boolean;
}

const LanguageTab = ({ isLoading }: LanguageTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pokrok ve výuce němčiny</CardTitle>
        <CardDescription>Detailní statistiky vašeho učení</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Celkový pokrok</span>
                <span className="text-sm font-medium">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <LanguageStatsWidget />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguageTab;
