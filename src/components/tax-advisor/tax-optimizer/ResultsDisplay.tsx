
import React from "react";
import { ResultsDisplayProps } from "./types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, TrendingUp, Wallet } from "lucide-react";

const ResultsDisplay = ({ currentResult, optimizedResult, savings, displayCurrency }: ResultsDisplayProps) => {
  if (!currentResult) return null;
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('cs-CZ', { 
      style: 'decimal',
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(amount) + ' ' + displayCurrency;
  };
  
  const calculatePercentage = (value: number, total: number): string => {
    const percentage = (value / total) * 100;
    return percentage.toFixed(1) + '%';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Výsledky daňové optimalizace</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">Aktuální situace</CardTitle>
            <CardDescription>Vaše současné daňové zatížení</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Hrubý příjem:</span>
                <span className="font-medium">{formatCurrency(currentResult.grossIncome)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Daň z příjmu:</span>
                <span className="font-medium">{formatCurrency(currentResult.taxAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sociální pojištění:</span>
                <span className="font-medium">{formatCurrency(currentResult.socialSecurity)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Zdravotní pojištění:</span>
                <span className="font-medium">{formatCurrency(currentResult.healthInsurance)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Čistý příjem:</span>
                <span className="font-bold">{formatCurrency(currentResult.netIncome)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Efektivní sazba daně:</span>
                <span className="text-muted-foreground">{calculatePercentage(currentResult.taxAmount, currentResult.grossIncome)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {optimizedResult && (
          <Card className="border-green-200 bg-green-50/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg">Optimalizovaná situace</CardTitle>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <CardDescription>Po uplatnění všech odpočtů</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Hrubý příjem:</span>
                  <span className="font-medium">{formatCurrency(optimizedResult.grossIncome)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Daň z příjmu:</span>
                  <span className="font-medium">{formatCurrency(optimizedResult.taxAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sociální pojištění:</span>
                  <span className="font-medium">{formatCurrency(optimizedResult.socialSecurity)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Zdravotní pojištění:</span>
                  <span className="font-medium">{formatCurrency(optimizedResult.healthInsurance)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium">Čistý příjem:</span>
                  <span className="font-bold">{formatCurrency(optimizedResult.netIncome)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Efektivní sazba daně:</span>
                  <span className="text-muted-foreground">{calculatePercentage(optimizedResult.taxAmount, optimizedResult.grossIncome)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {savings !== null && savings > 0 && (
        <Card className="border-green-300 bg-green-50/30">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Můžete ušetřit</h4>
                <p className="text-sm text-muted-foreground">Roční úspora na daních</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(savings)}</p>
              <p className="text-sm text-muted-foreground">ročně</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsDisplay;
