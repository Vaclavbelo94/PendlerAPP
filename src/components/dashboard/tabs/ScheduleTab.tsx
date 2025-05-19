
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ScheduleWidget from "../ScheduleWidget";

interface ScheduleTabProps {
  isLoading?: boolean;
}

const ScheduleTab = ({ isLoading = false }: ScheduleTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plánování směn</CardTitle>
        <CardDescription>Přehled vašich naplánovaných směn</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ScheduleWidget />
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleTab;
