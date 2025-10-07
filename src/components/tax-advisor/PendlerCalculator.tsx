import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calculator, Info, ExternalLink, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface CalculationResult {
  distance: number;
  workdays: number;
  taxClass: string;
  secondHome: boolean;
  deduction: number;
  refund: number;
  timestamp: number;
}

const PendlerCalculator = () => {
  const { t } = useTranslation('pendlerCalculator');
  const [distance, setDistance] = useState<string>('');
  const [workdays, setWorkdays] = useState<string>('');
  const [taxClass, setTaxClass] = useState<string>('');
  const [secondHome, setSecondHome] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [lastCalculation, setLastCalculation] = useState<CalculationResult | null>(null);

  // Load last calculation from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pendlerCalculation');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLastCalculation(parsed);
      } catch (e) {
        console.error('Failed to parse saved calculation');
      }
    }
  }, []);

  const loadLastCalculation = () => {
    if (lastCalculation) {
      setDistance(lastCalculation.distance.toString());
      setWorkdays(lastCalculation.workdays.toString());
      setTaxClass(lastCalculation.taxClass);
      setSecondHome(lastCalculation.secondHome);
      setResult(lastCalculation);
    }
  };

  const validateInputs = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!distance || parseFloat(distance) <= 0) {
      newErrors.distance = t('errorDistance');
    }
    
    if (!workdays || parseInt(workdays) <= 0 || parseInt(workdays) > 365) {
      newErrors.workdays = t('errorWorkdays');
    }
    
    if (!taxClass) {
      newErrors.taxClass = t('errorTaxClass');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTax = () => {
    if (!validateInputs()) return;

    setIsCalculating(true);
    
    // Simulate calculation delay for UX
    setTimeout(() => {
      const dist = parseFloat(distance);
      const days = parseInt(workdays);
      
      // Calculate deduction based on German Fahrtkostenpauschale
      let total = 0;
      for (let km = 1; km <= dist; km++) {
        total += (km <= 20 ? 0.30 : 0.38);
      }
      const deduction = total * days;
      
      // Calculate approximate refund based on tax class
      let refund = 0;
      const taxClassNum = parseInt(taxClass);
      
      switch (taxClassNum) {
        case 1:
          refund = deduction * 0.15;
          break;
        case 2:
          refund = deduction * 0.16;
          break;
        case 3:
          refund = deduction * 0.20;
          break;
        case 4:
          refund = deduction * 0.15;
          break;
        case 5:
          refund = deduction * 0.10;
          break;
        case 6:
          refund = deduction * 0.12;
          break;
        default:
          refund = deduction * 0.15;
      }
      
      // Add bonus for second home
      if (secondHome) {
        refund += 500;
      }
      
      const calculationResult: CalculationResult = {
        distance: dist,
        workdays: days,
        taxClass,
        secondHome,
        deduction,
        refund: Math.round(refund),
        timestamp: Date.now()
      };
      
      setResult(calculationResult);
      
      // Save to localStorage
      localStorage.setItem('pendlerCalculation', JSON.stringify(calculationResult));
      setLastCalculation(calculationResult);
      
      setIsCalculating(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
            <Calculator className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            {t('title')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('description')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {lastCalculation && !result && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent/10 p-4 rounded-lg border border-accent/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  {t('lastCalculation')}: {new Date(lastCalculation.timestamp).toLocaleDateString()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadLastCalculation}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t('loadLastCalculation')}
                </Button>
              </div>
            </motion.div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="distance" className="text-base">
                {t('distance')}
              </Label>
              <Input
                id="distance"
                type="number"
                placeholder={t('distancePlaceholder')}
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className={`text-lg ${errors.distance ? 'border-destructive' : ''}`}
              />
              {errors.distance && (
                <p className="text-sm text-destructive">{errors.distance}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workdays" className="text-base">
                {t('workdays')}
              </Label>
              <Input
                id="workdays"
                type="number"
                placeholder={t('workdaysPlaceholder')}
                value={workdays}
                onChange={(e) => setWorkdays(e.target.value)}
                className={`text-lg ${errors.workdays ? 'border-destructive' : ''}`}
              />
              {errors.workdays && (
                <p className="text-sm text-destructive">{errors.workdays}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxClass" className="text-base">
              {t('taxClass')}
            </Label>
            <Select value={taxClass} onValueChange={setTaxClass}>
              <SelectTrigger className={`text-lg ${errors.taxClass ? 'border-destructive' : ''}`}>
                <SelectValue placeholder={t('taxClassPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {t(`taxClass${num}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.taxClass && (
              <p className="text-sm text-destructive">{errors.taxClass}</p>
            )}
          </div>

          <div className="flex items-start space-x-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <Switch
              id="secondHome"
              checked={secondHome}
              onCheckedChange={setSecondHome}
              className="mt-1"
            />
            <div className="space-y-1 flex-1">
              <Label htmlFor="secondHome" className="text-base cursor-pointer">
                {t('secondHome')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('secondHomeDescription')}
              </p>
            </div>
          </div>

          <Button
            onClick={calculateTax}
            className="w-full text-lg h-12 gap-2"
            disabled={isCalculating}
          >
            {isCalculating ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Calculator className="h-5 w-5" />
                {t('calculate')}
              </>
            )}
          </Button>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-6 md:p-8 rounded-xl border-2 border-primary/30 shadow-lg">
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    {t('result')}
                  </p>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="text-4xl md:text-6xl font-bold text-primary mb-4"
                  >
                    💶 {result.refund.toLocaleString()} €
                  </motion.div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
                    <div>
                      <p className="text-muted-foreground">{t('summaryDistance')}:</p>
                      <p className="font-semibold">{result.distance} km × {result.workdays} {t('summaryDays')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('summaryDeduction')}:</p>
                      <p className="font-semibold">{Math.round(result.deduction).toLocaleString()} €</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('summaryTaxClass')}:</p>
                      <p className="font-semibold">{result.taxClass}</p>
                    </div>
                    {result.secondHome && (
                      <div className="col-span-2 bg-accent/20 p-2 rounded">
                        <p className="text-accent font-semibold">+ 500 € {t('secondHome')}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                  <p className="text-sm md:text-base">
                    {t('tip')}
                  </p>
                </div>

                <Card className="border-muted">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      {t('guideLink')}
                    </CardTitle>
                    <CardDescription>
                      {t('guideDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full gap-2" asChild>
                      <a
                        href="https://www.elster.de"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {t('openGuide')}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendlerCalculator;
