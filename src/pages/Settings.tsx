
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Nastavení</h1>
        <p className="text-muted-foreground">
          Spravujte své preference a nastavení aplikace
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Obecná nastavení</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Nastavení budou implementována v budoucí verzi.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
