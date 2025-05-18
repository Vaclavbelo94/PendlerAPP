
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import EducationWidget from "../EducationWidget";

interface EducationTabProps {
  isLoading: boolean;
}

const EducationTab = ({ isLoading }: EducationTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vzdělávací programy</CardTitle>
        <CardDescription>Sledujte svůj pokrok ve vzdělávacích kurzech</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <EducationWidget />
        )}
      </CardContent>
    </Card>
  );
};

export default EducationTab;
