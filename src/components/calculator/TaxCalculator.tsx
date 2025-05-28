import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaxCalculatorProps {
  onCalculate?: (inputs: Record<string, any>, result: Record<string, any>) => void;
  calculationHistory?: Array<{
    id?: string;
    inputs: Record<string, any>;
    results: Record<string, any>; // Changed from 'result' to 'results'
    created_at?: string;
  }>;
}

const formSchema = z.object({
  income: z.string().min(1, 'Zadejte příjem'),
  taxClass: z.string().min(1, 'Vyberte daňovou třídu'),
  hasChildren: z.boolean().default(false),
  numChildren: z.string().optional(),
  hasPension: z.boolean().default(false),
  hasHealthInsurance: z.boolean().default(true),
  church: z.boolean().default(false),
  additionalDeductions: z.string().default('0'),
});

const TaxCalculator: React.FC<TaxCalculatorProps> = ({ onCalculate, calculationHistory = [] }) => {
  const [results, setResults] = useState({
    grossIncome: 0,
    incomeTax: 0,
    socialInsurance: 0,
    healthInsurance: 0,
    netIncome: 0,
    taxRate: 0,
    churchTax: 0,
    childBenefit: 0,
  });
  const [isCalculated, setIsCalculated] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: '',
      taxClass: '1',
      hasChildren: false,
      numChildren: '0',
      hasPension: false,
      hasHealthInsurance: true,
      church: false,
      additionalDeductions: '0',
    },
  });

  const { watch } = form;
  const hasChildren = watch('hasChildren');

  const calculateTax = (data: z.infer<typeof formSchema>) => {
    // Konverze vstupů na čísla
    const income = parseFloat(data.income);
    const taxClass = parseInt(data.taxClass);
    const numChildren = data.hasChildren ? parseInt(data.numChildren || '0') : 0;
    const additionalDeductions = parseFloat(data.additionalDeductions || '0');

    // Základní výpočty pro německou daň z příjmu
    let incomeTax = 0;
    let socialInsurance = 0;
    let healthInsurance = 0;
    let churchTax = 0;
    let childBenefit = 0;
    
    // Jednoduchý výpočet daně z příjmu podle třídy
    // Toto je zjednodušený model, skutečný výpočet je složitější
    const taxRates = {
      1: 0.25, // Svobodní, rozvedení
      2: 0.23, // Samoživitelé
      3: 0.20, // Vdaní/ženatí s nižším příjmem
      4: 0.22, // Vdaní/ženatí se srovnatelným příjemem
      5: 0.27, // Vdaní/ženatí s vyšším příjemem
      6: 0.30, // Další příjmy
    };

    incomeTax = income * (taxRates[taxClass as keyof typeof taxRates] || 0.25);
    
    // Sociální pojištění (cca 20% z hrubé mzdy)
    socialInsurance = income * 0.2;
    
    // Zdravotní pojištění (cca 7.5% z hrubé mzdy)
    healthInsurance = data.hasHealthInsurance ? income * 0.075 : 0;
    
    // Církevní daň (8-9% z daně z příjmu)
    churchTax = data.church ? incomeTax * 0.09 : 0;
    
    // Přídavky na děti
    if (numChildren > 0) {
      // Měsíční přídavek cca 220 EUR na dítě
      childBenefit = numChildren * 220;
    }
    
    // Odečtení dalších odpočtů
    const totalDeductions = incomeTax + socialInsurance + healthInsurance + churchTax - additionalDeductions;
    
    // Čistý příjem
    const netIncome = income - totalDeductions + childBenefit;
    
    // Celková daňová sazba
    const taxRate = (totalDeductions / income) * 100;

    const results = {
      grossIncome: income,
      incomeTax,
      socialInsurance,
      healthInsurance,
      netIncome,
      taxRate,
      churchTax,
      childBenefit,
    };
    
    setResults(results);
    setIsCalculated(true);
    
    if (onCalculate) {
      onCalculate(data, results);
    }
  };

  const loadFromHistory = (historyItem: any) => {
    if (historyItem?.inputs) {
      form.reset(historyItem.inputs);
      setResults(historyItem.results); // Changed from historyItem.result to historyItem.results
      setIsCalculated(true);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Německý daňový kalkulátor</CardTitle>
          <CardDescription>
            Vypočítejte svou daň z příjmu a čistou mzdu v Německu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(calculateTax)} className="space-y-6">
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hrubý měsíční příjem (EUR)</FormLabel>
                    <FormControl>
                      <Input placeholder="např. 3000" {...field} />
                    </FormControl>
                    <FormDescription>
                      Zadejte svůj hrubý měsíční příjem v eurech
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxClass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daňová třída (Steuerklasse)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vyberte daňovou třídu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 - Svobodní, rozvedení</SelectItem>
                        <SelectItem value="2">2 - Samoživitelé</SelectItem>
                        <SelectItem value="3">3 - Manželé (nižší příjem)</SelectItem>
                        <SelectItem value="4">4 - Manželé (srovnatelný příjem)</SelectItem>
                        <SelectItem value="5">5 - Manželé (vyšší příjem)</SelectItem>
                        <SelectItem value="6">6 - Další příjmy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Vaše daňová třída určuje výši daňových odpočtů
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasChildren"
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
                        Mám nezaopatřené děti
                      </FormLabel>
                      <FormDescription>
                        Ovlivňuje výši přídavků na děti (Kindergeld)
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {hasChildren && (
                <FormField
                  control={form.control}
                  name="numChildren"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Počet dětí</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="hasPension"
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
                          Penzijní připojištění
                        </FormLabel>
                        <FormDescription>
                          Mám uzavřené soukromé penzijní připojištění
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasHealthInsurance"
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
                          Zákonné zdravotní pojištění
                        </FormLabel>
                        <FormDescription>
                          Platím zákonné zdravotní pojištění v Německu
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="church"
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
                          Církevní daň
                        </FormLabel>
                        <FormDescription>
                          Platím církevní daň v Německu (Kirchensteuer)
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="additionalDeductions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Další měsíční odpočty (EUR)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="0" />
                    </FormControl>
                    <FormDescription>
                      Další daňové odpočty (např. náklady na dojíždění)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">Vypočítat</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isCalculated && (
        <Card>
          <CardHeader>
            <CardTitle>Výsledek výpočtu</CardTitle>
            <CardDescription>
              Přehled vaší daňové situace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hrubý měsíční příjem</p>
                  <p className="text-lg font-semibold">{results.grossIncome.toFixed(2)} EUR</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Čistý měsíční příjem</p>
                  <p className="text-lg font-semibold">{results.netIncome.toFixed(2)} EUR</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Srážky:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Daň z příjmu</p>
                    <p className="font-medium">-{results.incomeTax.toFixed(2)} EUR</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sociální pojištění</p>
                    <p className="font-medium">-{results.socialInsurance.toFixed(2)} EUR</p>
                  </div>
                  {results.healthInsurance > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Zdravotní pojištění</p>
                      <p className="font-medium">-{results.healthInsurance.toFixed(2)} EUR</p>
                    </div>
                  )}
                  {results.churchTax > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Církevní daň</p>
                      <p className="font-medium">-{results.churchTax.toFixed(2)} EUR</p>
                    </div>
                  )}
                </div>
              </div>

              {results.childBenefit > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Přídavky na děti</p>
                    <p className="font-medium text-green-600">+{results.childBenefit.toFixed(2)} EUR</p>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Efektivní daňová zátěž</p>
                <p className="font-semibold">{results.taxRate.toFixed(2)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {calculationHistory && calculationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historie výpočtů</CardTitle>
            <CardDescription>
              Vaše poslední výpočty
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calculationHistory.map((item, index) => (
                <div key={item.id || index} className="flex justify-between items-center p-3 border rounded-md hover:bg-secondary/20 cursor-pointer" onClick={() => loadFromHistory(item)}>
                  <div>
                    <p className="font-medium">{item.inputs.income} EUR (třída {item.inputs.taxClass})</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.created_at || Date.now()).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>Čistý příjem: <span className="font-medium">{item.results.netIncome?.toFixed(2)} EUR</span></p>
                    <p className="text-sm text-muted-foreground">Daň: {item.results.taxRate?.toFixed(2)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaxCalculator;
