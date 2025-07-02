
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldOffIcon className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Přístup odepřen</CardTitle>
          <CardDescription>
            Nemáte oprávnění pro přístup k této stránce
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Pro přístup k této funkci potřebujete vyšší úroveň oprávnění.
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/dashboard">
                Zpět na dashboard
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link to="/premium">
                Upgrade na Premium
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
