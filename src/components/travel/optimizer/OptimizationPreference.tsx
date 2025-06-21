
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MobileOptimizedCard } from '@/components/ui/mobile-optimized-card';
import { useLanguage } from '@/hooks/useLanguage';

interface OptimizationPreferenceProps {
  value: string;
  onChange: (value: string) => void;
}

const OptimizationPreference: React.FC<OptimizationPreferenceProps> = ({
  value,
  onChange
}) => {
  const { t } = useLanguage();

  const preferences = [
    { id: 'time', label: t('fastest'), description: t('duration') },
    { id: 'cost', label: t('cheapest'), description: t('cheapest') },
    { id: 'comfort', label: t('mostComfortable'), description: t('mostComfortable') },
    { id: 'eco', label: t('mostEcoFriendly'), description: t('mostEcoFriendly') }
  ];

  return (
    <MobileOptimizedCard title={t('optimizeRoute')} compact>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="space-y-3">
          {preferences.map((pref) => (
            <div key={pref.id} className="flex items-center space-x-3">
              <RadioGroupItem value={pref.id} id={pref.id} />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor={pref.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {pref.label}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {pref.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>
    </MobileOptimizedCard>
  );
};

export default OptimizationPreference;
