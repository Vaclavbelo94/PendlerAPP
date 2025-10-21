import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, Clock, Euro, Zap, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WageCalculation {
  month: string;
  hours: number;
  overtimeHours: number;
  hourlyRate: number;
  overtimeBonus: number;
  normalPay: number;
  overtimePay: number;
  totalPay: number;
  totalHours: number;
  avgHourly: number;
  timestamp: number;
}

const WageCalculator = () => {
  const { t } = useTranslation('wageCalculator');
  const { toast } = useToast();
  
  const [hours, setHours] = useState<number>(160);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [hourlyRate, setHourlyRate] = useState<number>(15);
  const [overtimeBonus, setOvertimeBonus] = useState<number>(25);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [result, setResult] = useState<WageCalculation | null>(null);
  const [history, setHistory] = useState<WageCalculation[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('wage_calculator_history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } catch (e) {
        console.error('Failed to parse wage history', e);
      }
    }
    
    // Set current month as default
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setSelectedMonth(monthKey);
  }, []);

  const handleCalculate = () => {
    if (hours <= 0 || hourlyRate <= 0) {
      toast({
        title: "Chyba",
        description: "Prosím vyplňte všechny povinné údaje",
        variant: "destructive"
      });
      return;
    }

    const normalPay = hours * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * (1 + overtimeBonus / 100);
    const totalPay = normalPay + overtimePay;
    const totalHours = hours + overtimeHours;
    const avgHourly = totalHours > 0 ? totalPay / totalHours : 0;

    const calculation: WageCalculation = {
      month: selectedMonth,
      hours,
      overtimeHours,
      hourlyRate,
      overtimeBonus,
      normalPay,
      overtimePay,
      totalPay,
      totalHours,
      avgHourly,
      timestamp: Date.now()
    };

    setResult(calculation);

    // Save to history (keep last 12 months)
    const updatedHistory = [calculation, ...history.filter(h => h.month !== selectedMonth)].slice(0, 12);
    setHistory(updatedHistory);
    localStorage.setItem('wage_calculator_history', JSON.stringify(updatedHistory));

    toast({
      title: t('saveSuccess'),
      description: `${t('totalPay')}: ${totalPay.toFixed(2)} €`
    });
  };

  const handleReset = () => {
    localStorage.removeItem('wage_calculator_history');
    setHistory([]);
    setResult(null);
    toast({
      title: t('deleteSuccess')
    });
  };

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const monthIndex = parseInt(month) - 1;
    const months = [
      t('january'), t('february'), t('march'), t('april'),
      t('may'), t('june'), t('july'), t('august'),
      t('september'), t('october'), t('november'), t('december')
    ];
    return `${months[monthIndex]} ${year}`;
  };

  const calculateGrowth = () => {
    if (history.length < 2) return null;
    const current = history[0].avgHourly;
    const previous = history[1].avgHourly;
    const growth = ((current - previous) / previous) * 100;
    return growth;
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              {t('title')}
            </CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hours">{t('hours')}</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overtime">{t('overtime')}</Label>
                <Input
                  id="overtime"
                  type="number"
                  min="0"
                  value={overtimeHours}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOvertimeHours(val === '' ? 0 : Number(val));
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0') {
                      e.target.select();
                    }
                  }}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">{t('hourlyRate')}</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overtimeBonus">{t('overtimeBonus')}</Label>
                <Input
                  id="overtimeBonus"
                  type="number"
                  min="0"
                  value={overtimeBonus}
                  onChange={(e) => setOvertimeBonus(Number(e.target.value))}
                  className="text-lg"
                />
              </div>
            </div>

            <Button onClick={handleCalculate} className="w-full" size="lg">
              <Calculator className="w-4 h-4 mr-2" />
              {t('calculate')}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Result Card */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">{t('summary')}</CardTitle>
              <CardDescription>{getMonthName(result.month)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                  <Euro className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('totalPay')}</p>
                    <p className="text-2xl font-bold text-primary">{result.totalPay.toFixed(2)} €</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('totalHours')}</p>
                    <p className="text-2xl font-bold">{result.totalHours} h</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                  <Zap className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('overtimePay')}</p>
                    <p className="text-2xl font-bold text-yellow-600">{result.overtimePay.toFixed(2)} €</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('avgHourly')}</p>
                    <p className="text-2xl font-bold text-green-600">{result.avgHourly.toFixed(2)} €</p>
                  </div>
                </div>
              </div>

              {calculateGrowth() && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {t('growth', { percent: calculateGrowth()?.toFixed(1) })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* History Card */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('history')}</CardTitle>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('reset')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.map((calc, index) => (
                  <div
                    key={index}
                    className="p-4 bg-secondary/20 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{getMonthName(calc.month)}</p>
                      <p className="text-sm text-muted-foreground">
                        {calc.totalHours}h ({calc.overtimeHours}h {t('overtime').toLowerCase()})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">{calc.totalPay.toFixed(2)} €</p>
                      <p className="text-sm text-muted-foreground">
                        Ø {calc.avgHourly.toFixed(2)} €/h
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default WageCalculator;
