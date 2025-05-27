
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface OptimizedPremiumGateProps {
  title?: string;
  description?: string;
}

const OptimizedPremiumGate: React.FC<OptimizedPremiumGateProps> = ({ 
  title = "Prémiová funkce",
  description = "Tato funkce je dostupná pouze pro uživatele s prémiový účtem"
}) => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card className="text-center border-amber-200 bg-amber-50/50">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-amber-100">
              <LockIcon className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-amber-800">{title}</CardTitle>
          <CardDescription className="text-amber-700">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-amber-700">
            Získejte Premium pro přístup ke všem funkcím aplikace Pendler Buddy a usnadněte si práci v Německu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/premium")} 
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <ShieldIcon className="mr-2 h-4 w-4" />
              Aktivovat Premium
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Zpět na hlavní stránku
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedPremiumGate;
