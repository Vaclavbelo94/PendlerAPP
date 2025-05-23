
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CrossBorderTaxCalculatorProps {
  onCalculate?: (inputs: Record<string, any>, result: Record<string, any>) => void;
  calculationHistory?: Array<{
    id?: string;
    inputs: Record<string, any>;
    result: Record<string, any>;
    created_at?: string;
  }>;
}

const formSchema = z.object({
  incomeDE: z.string().min(1, 'Zadejte příjem v Německu'),
  incomeCZ: z.string().min(1, 'Zadejte případný příjem v ČR'),
  isMarried: z.boolean().default(false),
  spouseIncome: z.string().optional(),
  workDaysDE: z.string().min(1, 'Zadejte počet pracovních dnů v Německu'),
  workDaysCZ: z.string().min(1, 'Zadejte počet pracovních dnů v ČR'),
  includeCommuteExpenses: z.boolean().default(false),
  commuteDistance: z.string().optional(),
  commuteWorkDays: z.string().optional(),
});

const CrossBorderTaxCalculator: React.FC<CrossBorderTaxCalculatorProps> = ({ onCalculate, calculationHistory = [] }) => {
  const [results, setResults] = useState({
    totalIncome: 0,
    taxDE: 0,
    taxCZ: 0,
    creditMethod: {
      totalTax: 0,
      effectiveTaxRate: 0,
      netIncome: 0
    },
    exemptionMethod: {
      totalTax: 0,
      effectiveTaxRate: 0,
      netIncome: 0
    },
    commuteDeduction: 0,
    advantage: 'credit' // 'credit' nebo 'exemption'
  });
  const [isCalculated, setIsCalculated] = useState(false);
  const [activeTab, setActiveTab] = useState('input');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      incomeDE: '',
      incomeCZ: '0',
      isMarried: false,
      spouseIncome: '0',
      workDaysDE: '220',
      workDaysCZ: '30',
      includeCommuteExpenses: false,
      commuteDistance: '0',
      commuteWorkDays: '220',
    },
  });

  const { watch } = form;
  const isMarried = watch('isMarried');
  const includeCommuteExpenses = watch('includeCommuteExpenses');

  const calculateTax = (data: z.infer<typeof formSchema>) => {
    // Konverze vstupů na čísla
    const incomeDE = parseFloat(data.incomeDE) || 0;
    const incomeCZ = parseFloat(data.incomeCZ) || 0;
    const spouseIncome = data.isMarried ? parseFloat(data.spouseIncome || '0') : 0;
    const workDaysDE = parseInt(data.workDaysDE) || 0;
    const workDaysCZ = parseInt(data.workDaysCZ) || 0;
    const commuteDistance = data.includeCommuteExpenses ? parseFloat(data.commuteDistance || '0') : 0;
    const commuteWorkDays = data.includeCommuteExpenses ? parseInt(data.commuteWorkDays || '0') : 0;
    
    // Výpočet celkového příjmu
    const totalIncome = incomeDE + incomeCZ;
    
    // Výpočet odpočtu na dojíždění (0.30 EUR/km v Německu)
    const commuteDeduction = data.includeCommuteExpenses ? commuteDistance * commuteWorkDays * 0.30 : 0;
    
    // Výpočet daně v Německu (zjednodušená sazba 25%)
    const taxRateDE = 0.25;
    const taxableIncomeDE = incomeDE - commuteDeduction;
    const taxDE = Math.max(0, taxableIncomeDE * taxRateDE);
    
    // Výpočet daně v ČR (zjednodušená sazba 15%)
    const taxRateCZ = 0.15;
    const taxCZ = incomeCZ * taxRateCZ;
    
    // Metoda zápočtu daně
    // V této metodě se daň zaplacená v jedné zemi odečítá od daňové povinnosti v druhé zemi
    const totalTaxCredit = taxDE + taxCZ;
    const effectiveTaxRateCredit = (totalTaxCredit / totalIncome) * 100;
    const netIncomeCredit = totalIncome - totalTaxCredit;
    
    // Metoda vynětí příjmu
    // V této metodě se příjem zdaněný v jedné zemi vyjímá ze zdanitelných příjmů v druhé zemi
    const totalIncomeCZ = totalIncome;
    const incomeTaxRatioCZ = incomeCZ / totalIncomeCZ;
    const taxExemption = taxCZ + (taxDE * (1 - incomeTaxRatioCZ));
    const effectiveTaxRateExemption = (taxExemption / totalIncome) * 100;
    const netIncomeExemption = totalIncome - taxExemption;
    
    // Určení výhodnější metody
    const advantage = netIncomeCredit > netIncomeExemption ? 'credit' : 'exemption';
    
    const results = {
      totalIncome,
      taxDE,
      taxCZ,
      creditMethod: {
        totalTax: totalTaxCredit,
        effectiveTaxRate: effectiveTaxRateCredit,
        netIncome: netIncomeCredit
      },
      exemptionMethod: {
        totalTax: taxExemption,
        effectiveTaxRate: effectiveTaxRateExemption,
        netIncome: netIncomeExemption
      },
      commuteDeduction,
      advantage
    };
    
    setResults(results);
    setIsCalculated(true);
    setActiveTab('results');
    
    if (onCalculate) {
      onCalculate(data, results);
    }
  };

  const loadFromHistory = (historyItem: any) => {
    if (historyItem?.inputs) {
      form.reset(historyItem.inputs);
      setResults(historyItem.result);
      setIsCalculated(true);
      setActiveTab('results');
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="input">Vstupní údaje</TabsTrigger>
          {isCalculated && <TabsTrigger value="results">Výsledky</TabsTrigger>}
          {calculationHistory.length > 0 && <TabsTrigger value="history">Historie</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="input" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Přeshraniční daňový kalkulátor</CardTitle>
              <CardDescription>
                Vypočítejte daňovou situaci při práci v Německu a bydlení v ČR
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(calculateTax)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Příjmy</h3>
                    
                    <FormField
                      control={form.control}
                      name="incomeDE"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roční příjem v Německu (EUR)</FormLabel>
                          <FormControl>
                            <Input placeholder="např. 35000" {...field} />
                          </FormControl>
                          <FormDescription>
                            Zadejte svůj roční příjem v Německu v eurech
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="incomeCZ"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roční příjem v ČR (EUR)</FormLabel>
                          <FormControl>
                            <Input placeholder="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Zadejte případný příjem v ČR v eurech
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isMarried"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Jsem ženatý/vdaná
                            </FormLabel>
                            <FormDescription>
                              Ovlivňuje daňovou třídu v Německu
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {isMarried && (
                      <FormField
                        control={form.control}
                        name="spouseIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Roční příjem manžela/manželky (EUR)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="0" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Pracovní dny</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="workDaysDE"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Počet pracovních dnů v Německu</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="220" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="workDaysCZ"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Počet pracovních dnů v ČR</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="0" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Odpočty a výdaje</h3>
                    
                    <FormField
                      control={form.control}
                      name="includeCommuteExpenses"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Zahrnout náklady na dojíždění
                            </FormLabel>
                            <FormDescription>
                              V Německu lze odečíst 0,30 EUR za každý kilometr dojíždění
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {includeCommuteExpenses && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="commuteDistance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vzdálenost dojíždění (km)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="commuteWorkDays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Počet dní dojíždění za rok</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="220" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full">Vypočítat</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="pt-4">
          {isCalculated && (
            <Card>
              <CardHeader>
                <CardTitle>Výsledek výpočtu</CardTitle>
                <CardDescription>
                  Porovnání metod zdanění pro přeshraniční práci
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Celkový roční příjem</p>
                      <p className="text-lg font-semibold">{results.totalIncome.toFixed(2)} EUR</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Daň v Německu</p>
                      <p className="text-lg font-semibold">{results.taxDE.toFixed(2)} EUR</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Daň v ČR</p>
                      <p className="text-lg font-semibold">{results.taxCZ.toFixed(2)} EUR</p>
                    </div>
                  </div>

                  {results.commuteDeduction > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground">Odpočet za dojíždění</p>
                        <p className="text-lg font-semibold text-green-600">{results.commuteDeduction.toFixed(2)} EUR</p>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className={results.advantage === 'credit' ? 'border-green-500' : ''}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Metoda zápočtu daně</CardTitle>
                        <CardDescription>
                          Daň zaplacená v zahraničí se odečítá od celkové daňové povinnosti
                        </CardDescription>
                        {results.advantage === 'credit' && (
                          <div className="mt-1 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md inline-block">
                            Výhodnější metoda
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Celková daň</p>
                            <p className="font-medium">{results.creditMethod.totalTax.toFixed(2)} EUR</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Efektivní daňová sazba</p>
                            <p className="font-medium">{results.creditMethod.effectiveTaxRate.toFixed(2)}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Čistý příjem</p>
                            <p className="font-semibold">{results.creditMethod.netIncome.toFixed(2)} EUR</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={results.advantage === 'exemption' ? 'border-green-500' : ''}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Metoda vynětí příjmu</CardTitle>
                        <CardDescription>
                          Příjem zdaněný v zahraničí se vyjímá ze zdanitelného příjmu
                        </CardDescription>
                        {results.advantage === 'exemption' && (
                          <div className="mt-1 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md inline-block">
                            Výhodnější metoda
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Celková daň</p>
                            <p className="font-medium">{results.exemptionMethod.totalTax.toFixed(2)} EUR</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Efektivní daňová sazba</p>
                            <p className="font-medium">{results.exemptionMethod.effectiveTaxRate.toFixed(2)}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Čistý příjem</p>
                            <p className="font-semibold">{results.exemptionMethod.netIncome.toFixed(2)} EUR</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm">
                      <strong>Tip:</strong> Česká republika má s Německem uzavřenu smlouvu o zamezení dvojího zdanění, která umožňuje použít buď metodu zápočtu, nebo metodu vynětí pro zahraniční příjmy. Je vhodné konzultovat s daňovým poradcem, která metoda je pro vaši situaci nejvýhodnější.
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button variant="outline" onClick={() => setActiveTab('input')}>
                      Upravit údaje
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historie výpočtů</CardTitle>
              <CardDescription>
                Vaše poslední výpočty přeshraničního zdanění
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {calculationHistory.length > 0 ? (
                  calculationHistory.map((item, index) => (
                    <div key={item.id || index} className="flex justify-between items-center p-3 border rounded-md hover:bg-secondary/20 cursor-pointer" onClick={() => loadFromHistory(item)}>
                      <div>
                        <p className="font-medium">
                          DE: {item.inputs.incomeDE} EUR
                          {parseInt(item.inputs.incomeCZ) > 0 && `, CZ: ${item.inputs.incomeCZ} EUR`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.created_at || Date.now()).toLocaleDateString('cs-CZ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p>
                          <span className="text-sm text-muted-foreground">Výhodnější metoda: </span>
                          <span className="font-medium">
                            {item.result.advantage === 'credit' ? 'Zápočet' : 'Vynětí'}
                          </span>
                        </p>
                        <p className="text-sm">
                          Čistý příjem: {item.result[`${item.result.advantage}Method`].netIncome.toFixed(2)} EUR
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-muted-foreground">Zatím nemáte žádné uložené výpočty</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrossBorderTaxCalculator;
