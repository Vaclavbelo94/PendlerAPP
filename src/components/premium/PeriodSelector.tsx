
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type PaymentPeriod = 'monthly' | 'yearly';

interface PeriodSelectorProps {
  selectedPeriod: PaymentPeriod;
  onPeriodChange: (period: PaymentPeriod) => void;
}

const PeriodSelector = ({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) => {
  const periods = [
    {
      id: 'monthly' as PaymentPeriod,
      label: 'Měsíční',
      price: 99,
      description: 'Placeno každý měsíc',
      savings: null
    },
    {
      id: 'yearly' as PaymentPeriod,
      label: 'Roční',
      price: 990,
      description: 'Placeno jednou ročně',
      savings: '17% úspora'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Vyberte období platby</h3>
        <p className="text-sm text-muted-foreground">
          Ušetřete s ročním předplatným
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {periods.map((period) => (
          <Card
            key={period.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedPeriod === period.id
                ? 'ring-2 ring-primary border-primary'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onPeriodChange(period.id)}
          >
            <CardContent className="p-4">
              <div className="text-center">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{period.label}</h4>
                  {period.savings && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {period.savings}
                    </Badge>
                  )}
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold">{period.price} Kč</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    {period.id === 'yearly' ? '/rok' : '/měsíc'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{period.description}</p>
                {period.id === 'yearly' && (
                  <p className="text-xs text-green-600 mt-1">
                    Odpovídá 82,5 Kč/měsíc
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PeriodSelector;
