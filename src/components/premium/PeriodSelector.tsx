
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

export type PaymentPeriod = 'monthly' | 'yearly';

interface PricingInfo {
  currency: string;
  monthlyPrice: number;
  yearlyPrice: number;
  savings: string;
}

interface PeriodSelectorProps {
  selectedPeriod: PaymentPeriod;
  onPeriodChange: (period: PaymentPeriod) => void;
  pricing: PricingInfo;
}

const PeriodSelector = ({ selectedPeriod, onPeriodChange, pricing }: PeriodSelectorProps) => {
  const { t } = useTranslation('premium');

  const periods = [
    {
      id: 'monthly' as PaymentPeriod,
      label: t('periods.monthly'),
      price: pricing.monthlyPrice,
      description: t('periods.monthlyDesc'),
      savings: null
    },
    {
      id: 'yearly' as PaymentPeriod,
      label: t('periods.yearly'),
      price: pricing.yearlyPrice,
      description: t('periods.yearlyDesc'),
      savings: t('periods.yearlySavings')
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          {t('periods.selectTitle')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('periods.selectSubtitle')}
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
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {period.savings}
                    </Badge>
                  )}
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold">{period.price} {pricing.currency}</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    {period.id === 'yearly' ? t('periods.perYear') : t('periods.perMonth')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{period.description}</p>
                {period.id === 'yearly' && (
                <p className="text-xs text-green-600 mt-1">
                  {t('periods.yearlyEquivalent', {
                    amount: (pricing.yearlyPrice / 12).toFixed(2),
                    currency: pricing.currency
                  })}
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
