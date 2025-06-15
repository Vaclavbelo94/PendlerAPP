import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import EducationWidget from './EducationWidget';

const EducationTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vzdělávání a školení</CardTitle>
        <CardDescription>Přehled vašich absolvovaných školení a kurzů</CardDescription>
      </CardHeader>
      <CardContent>
        <EducationWidget />
      </CardContent>
    </Card>
  );
};

export default EducationTab;
