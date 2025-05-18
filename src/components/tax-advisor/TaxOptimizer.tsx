import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Calculator, Check, Download, FileText, Info } from "lucide-react";
import { useTaxCalculator } from '@/hooks/useTaxCalculator';
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserProfileData } from '@/utils/tax';

const formSchema = z.object({
  country: z.string(),
  income: z.string().min(1, "Zadejte výši příjmu"),
  taxClass: z.string().optional(),
  children: z.string().default("0"),
  married: z.boolean().default(false),
  church: z.boolean().default(false),
  commuteDistance: z.string().optional(),
  workDays: z.string().optional(),
  housingCosts: z.string().optional(),
  workEquipment: z.string().optional(),
  insurance: z.string().optional(),
  otherExpenses: z.string().optional(),
});

const TaxOptimizer = () => {
  const { user } = useAuth();
  const { calculateTax } = useTaxCalculator();
  const [displayCurrency, setDisplayCurrency] = useState<string>("EUR");
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [optimizedResult, setOptimizedResult] = useState<any>(null);
  const [savings, setSavings] = useState<number | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "de",
      income: "50000",
      taxClass: "1",
      children: "0",
      married: false,
      church: false,
      commuteDistance: "",
      workDays: "220",
      housingCosts: "",
      workEquipment: "",
      insurance: "",
      otherExpenses: "",
    },
  });

  const watchCountry = form.watch("country");
  const watchIncome = form.watch("income");

  // Update currency display based on country
  useEffect(() => {
    if (watchCountry === "de") {
      setDisplayCurrency("EUR");
    } else if (watchCountry === "cz") {
      setDisplayCurrency("CZK");
    }
  }, [watchCountry]);

  // Load user profile data if available
  useEffect(() => {
    if (user) {
      const loadUserProfile = async () => {
        try {
          const profileData = await fetchUserProfileData(user.id);
          
          if (profileData && profileData.commuteDistance) {
            form.setValue("commuteDistance", profileData.commuteDistance);
          }
        } catch (error) {
          console.error("Error loading profile data:", error);
        }
      };
      
      loadUserProfile();
    }
  }, [user, form]);

  // Calculate basic tax
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      const incomeValue = parseFloat(data.income);
      if (isNaN(incomeValue) || incomeValue <= 0) {
        toast.error("Zadejte platnou výši příjmu");
        return;
      }
      
      // Basic calculation without deductions
      const basicResult = calculateTax(incomeValue, {
        country: data.country,
        taxClass: data.taxClass,
        children: parseInt(data.children),
        married: data.married,
        church: data.church,
      });
      
      setCurrentResult(basicResult);
      
      // Calculate with optimizations if deductions provided
      let totalDeductions = 0;
      
      // Calculate commute deductions
      if (data.commuteDistance && data.workDays) {
        const commuteDistance = parseFloat(data.commuteDistance);
        const workDays = parseFloat(data.workDays);
        
        if (!isNaN(commuteDistance) && !isNaN(workDays) && commuteDistance > 0 && workDays > 0) {
          // Calculate using the progressive rate (0.30€ for first 20km, 0.38€ for additional km)
          let commuteDeduction = 0;
          if (commuteDistance <= 20) {
            commuteDeduction = commuteDistance * 0.30 * workDays;
          } else {
            commuteDeduction = (20 * 0.30 * workDays) + ((commuteDistance - 20) * 0.38 * workDays);
          }
          totalDeductions += commuteDeduction;
        }
      }
      
      // Add other deductions
      ["housingCosts", "workEquipment", "insurance", "otherExpenses"].forEach(field => {
        const value = parseFloat(data[field as keyof typeof data] as string);
        if (!isNaN(value) && value > 0) {
          totalDeductions += value;
        }
      });
      
      // Calculate optimized taxes if deductions exist
      if (totalDeductions > 0) {
        // Apply deductions to taxable income
        const optimizedIncome = Math.max(0, incomeValue - totalDeductions);
        
        const optimizedCalc = calculateTax(optimizedIncome, {
          country: data.country,
          taxClass: data.taxClass,
          children: parseInt(data.children),
          married: data.married,
          church: data.church,
        });
        
        setOptimizedResult(optimizedCalc);
        
        // Calculate savings (difference in tax amount)
        if (basicResult && optimizedCalc) {
          const taxSavings = basicResult.taxAmount - optimizedCalc.taxAmount;
          setSavings(taxSavings);
          
          // Show toast with savings
          toast.success(`Potenciální úspora na dani: ${taxSavings.toFixed(2)} ${displayCurrency}`);
        }
      } else {
        setOptimizedResult(null);
        setSavings(null);
      }
    } catch (error) {
      console.error('Chyba při výpočtu optimalizace daní:', error);
      toast.error("Došlo k chybě při výpočtu");
    }
  };

  const handleDownloadReport = () => {
    if (!currentResult) return;
    
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text("Zpráva o daňové optimalizaci", 105, 20, { align: 'center' });
      
      // Date
      const currentDate = new Date().toLocaleDateString('cs-CZ');
      doc.setFontSize(10);
      doc.text(`Datum: ${currentDate}`, 195, 10, { align: 'right' });
      
      // Input parameters
      doc.setFontSize(14);
      doc.text("Základní údaje", 15, 40);
      
      const formData = form.getValues();
      
      const basicData = [
        ['Země', formData.country === 'de' ? 'Německo' : 'Česká republika'],
        ['Roční hrubý příjem', `${formData.income} ${displayCurrency}`],
        ['Daňová třída', formData.taxClass || 'N/A'],
        ['Počet dětí', formData.children],
        ['Ženatý/vdaná', formData.married ? 'Ano' : 'Ne'],
        ['Církevní daň', formData.church ? 'Ano' : 'Ne']
      ];
      
      autoTable(doc, {
        startY: 45,
        head: [['Parametr', 'Hodnota']],
        body: basicData,
        theme: 'grid',
        headStyles: { fillColor: [60, 60, 60] }
      });
      
      // Deductions
      const deductionsY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("Odpočitatelné položky", 15, deductionsY);
      
      const deductionsData = [];
      
      // Calculate commute deduction for report
      if (formData.commuteDistance && formData.workDays) {
        const commuteDistance = parseFloat(formData.commuteDistance);
        const workDays = parseFloat(formData.workDays);
        
        if (!isNaN(commuteDistance) && !isNaN(workDays) && commuteDistance > 0 && workDays > 0) {
          let commuteDeduction = 0;
          if (commuteDistance <= 20) {
            commuteDeduction = commuteDistance * 0.30 * workDays;
          } else {
            commuteDeduction = (20 * 0.30 * workDays) + ((commuteDistance - 20) * 0.38 * workDays);
          }
          deductionsData.push(['Náklady na dojíždění', `${commuteDeduction.toFixed(2)} ${displayCurrency}`]);
        }
      }
      
      // Add other deductions to report
      if (formData.housingCosts && parseFloat(formData.housingCosts) > 0) {
        deductionsData.push(['Náklady na bydlení', `${formData.housingCosts} ${displayCurrency}`]);
      }
      
      if (formData.workEquipment && parseFloat(formData.workEquipment) > 0) {
        deductionsData.push(['Pracovní vybavení', `${formData.workEquipment} ${displayCurrency}`]);
      }
      
      if (formData.insurance && parseFloat(formData.insurance) > 0) {
        deductionsData.push(['Pojištění', `${formData.insurance} ${displayCurrency}`]);
      }
      
      if (formData.otherExpenses && parseFloat(formData.otherExpenses) > 0) {
        deductionsData.push(['Ostatní výdaje', `${formData.otherExpenses} ${displayCurrency}`]);
      }
      
      if (deductionsData.length > 0) {
        autoTable(doc, {
          startY: deductionsY + 5,
          head: [['Položka', 'Hodnota']],
          body: deductionsData,
          theme: 'grid',
          headStyles: { fillColor: [60, 60, 60] }
        });
      } else {
        doc.setFontSize(11);
        doc.text("Nebyly zadány žádné odpočitatelné položky", 15, deductionsY + 10);
      }
      
      // Results table
      const resultsY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 15 : deductionsY + 30;
      doc.setFontSize(14);
      doc.text("Výsledky výpočtu", 15, resultsY);
      
      const resultsData = [
        ['Hrubý příjem', `${currentResult.grossIncome.toFixed(2)} ${displayCurrency}`],
        ['Daň z příjmu', `${currentResult.taxAmount.toFixed(2)} ${displayCurrency}`],
        ['Sociální pojištění', `${currentResult.socialSecurity.toFixed(2)} ${displayCurrency}`],
        ['Zdravotní pojištění', `${currentResult.healthInsurance.toFixed(2)} ${displayCurrency}`],
        ['Čistý příjem', `${currentResult.netIncome.toFixed(2)} ${displayCurrency}`],
        ['Efektivní daňová sazba', `${(currentResult.effectiveTaxRate * 100).toFixed(2)}%`]
      ];
      
      autoTable(doc, {
        startY: resultsY + 5,
        head: [['Položka', 'Hodnota']],
        body: resultsData,
        theme: 'grid',
        headStyles: { fillColor: [60, 60, 60] }
      });
      
      // Optimized results if available
      if (optimizedResult) {
        const optimizedY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text("Výsledky s optimalizací", 15, optimizedY);
        
        const optimizedData = [
          ['Hrubý příjem po odečtení', `${optimizedResult.grossIncome.toFixed(2)} ${displayCurrency}`],
          ['Daň z příjmu', `${optimizedResult.taxAmount.toFixed(2)} ${displayCurrency}`],
          ['Sociální pojištění', `${optimizedResult.socialSecurity.toFixed(2)} ${displayCurrency}`],
          ['Zdravotní pojištění', `${optimizedResult.healthInsurance.toFixed(2)} ${displayCurrency}`],
          ['Čistý příjem', `${optimizedResult.netIncome.toFixed(2)} ${displayCurrency}`],
          ['Efektivní daňová sazba', `${(optimizedResult.effectiveTaxRate * 100).toFixed(2)}%`]
        ];
        
        autoTable(doc, {
          startY: optimizedY + 5,
          head: [['Položka', 'Hodnota']],
          body: optimizedData,
          theme: 'grid',
          headStyles: { fillColor: [60, 60, 60] }
        });
        
        // Savings calculation
        if (savings !== null) {
          const savingsY = (doc as any).lastAutoTable.finalY + 15;
          
          // Add highlight box for savings
          doc.setFillColor(230, 247, 230);
          doc.rect(15, savingsY, 180, 25, 'F');
          
          doc.setFontSize(14);
          doc.text("Celková úspora na dani", 20, savingsY + 10);
          
          doc.setFontSize(16);
          doc.setTextColor(0, 128, 0);
          doc.text(`${savings.toFixed(2)} ${displayCurrency}`, 20, savingsY + 20);
          doc.setTextColor(0, 0, 0);
        }
      }
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Pendler Buddy - Zpráva o daňové optimalizaci | Strana ${i} z ${pageCount}`, 105, 285, { align: 'center' });
      }
      
      // Save the document
      doc.save(`Daňová_optimalizace_${currentDate}.pdf`);
      
      toast.success("Zpráva byla úspěšně stažena");
    } catch (error) {
      console.error("Chyba při vytváření PDF:", error);
      toast.error("Při stahování zprávy došlo k chybě");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daňová optimalizace</CardTitle>
          <CardDescription>
            Spočítejte si potenciální úsporu na daních s využitím odpočitatelných položek
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculator">
            <TabsList className="mb-4">
              <TabsTrigger value="calculator">Kalkulačka</TabsTrigger>
              <TabsTrigger value="tips">Tipy na optimalizaci</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Základní údaje */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Základní údaje</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Země</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Vyberte zemi" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="de">Německo</SelectItem>
                                <SelectItem value="cz">Česká republika</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="income"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Roční hrubý příjem ({displayCurrency})</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {watchCountry === "de" && (
                        <FormField
                          control={form.control}
                          name="taxClass"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Daňová třída</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Vyberte třídu" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">Třída I</SelectItem>
                                  <SelectItem value="2">Třída II</SelectItem>
                                  <SelectItem value="3">Třída III</SelectItem>
                                  <SelectItem value="4">Třída IV</SelectItem>
                                  <SelectItem value="5">Třída V</SelectItem>
                                  <SelectItem value="6">Třída VI</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <FormField
                        control={form.control}
                        name="children"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Počet dětí</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="married"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Ženatý/vdaná</FormLabel>
                              <FormDescription>
                                Zohlednit manželský stav
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {watchCountry === "de" && (
                        <FormField
                          control={form.control}
                          name="church"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                              <div className="space-y-0.5">
                                <FormLabel>Církevní daň</FormLabel>
                                <FormDescription>
                                  Platíte církevní daň
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Odpočitatelné položky */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Odpočitatelné položky</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="commuteDistance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vzdálenost dojíždění (km)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormDescription>
                                Jednosměrná vzdálenost do práce
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="workDays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Počet pracovních dnů v roce</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="housingCosts"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Náklady na bydlení ({displayCurrency})</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormDescription>
                                Např. druhé bydlení v Německu
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="workEquipment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pracovní vybavení ({displayCurrency})</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormDescription>
                                Oděv, nástroje, vybavení
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="insurance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pojištění ({displayCurrency})</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Soukromé zdravotní, životní pojištění
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="otherExpenses"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ostatní výdaje ({displayCurrency})</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Další odpočitatelné položky
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button type="submit" size="lg" className="gap-2">
                      <Calculator className="h-5 w-5" />
                      Vypočítat daňovou optimalizaci
                    </Button>
                  </div>
                </form>
              </Form>
              
              {/* Results section */}
              {currentResult && (
                <div className="mt-8 space-y-6">
                  <Separator />
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-xl font-medium">Výsledky výpočtu</h3>
                    <Button
                      variant="outline"
                      onClick={handleDownloadReport}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Stáhnout zprávu
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic calculation */}
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Základní výpočet</CardTitle>
                        <CardDescription>Bez optimalizace</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <dl className="divide-y divide-gray-100">
                          <div className="grid grid-cols-2 py-2">
                            <dt className="text-sm font-medium">Hrubý příjem:</dt>
                            <dd className="text-sm text-right font-medium">
                              {currentResult.grossIncome.toFixed(2)} {displayCurrency}
                            </dd>
                          </div>
                          <div className="grid grid-cols-2 py-2">
                            <dt className="text-sm font-medium">Daň z příjmu:</dt>
                            <dd className="text-sm text-right font-medium text-destructive">
                              -{currentResult.taxAmount.toFixed(2)} {displayCurrency}
                            </dd>
                          </div>
                          <div className="grid grid-cols-2 py-2">
                            <dt className="text-sm font-medium">Sociální pojištění:</dt>
                            <dd className="text-sm text-right font-medium text-destructive">
                              -{currentResult.socialSecurity.toFixed(2)} {displayCurrency}
                            </dd>
                          </div>
                          <div className="grid grid-cols-2 py-2">
                            <dt className="text-sm font-medium">Zdravotní pojištění:</dt>
                            <dd className="text-sm text-right font-medium text-destructive">
                              -{currentResult.healthInsurance.toFixed(2)} {displayCurrency}
                            </dd>
                          </div>
                          <div className="grid grid-cols-2 py-2">
                            <dt className="text-base font-semibold">Čistý příjem:</dt>
                            <dd className="text-base text-right font-bold text-green-600">
                              {currentResult.netIncome.toFixed(2)} {displayCurrency}
                            </dd>
                          </div>
                          <div className="pt-2">
                            <p className="text-xs text-muted-foreground text-center">
                              Efektivní daňová sazba: {(currentResult.effectiveTaxRate * 100).toFixed(2)}%
                            </p>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>
                    
                    {/* Optimized calculation */}
                    {optimizedResult ? (
                      <Card className="border border-green-200 bg-green-50/40">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-lg">S optimalizací</CardTitle>
                              <CardDescription>Včetně odpočitatelných položek</CardDescription>
                            </div>
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <dl className="divide-y divide-gray-100">
                            <div className="grid grid-cols-2 py-2">
                              <dt className="text-sm font-medium">Hrubý příjem po odečtení:</dt>
                              <dd className="text-sm text-right font-medium">
                                {optimizedResult.grossIncome.toFixed(2)} {displayCurrency}
                              </dd>
                            </div>
                            <div className="grid grid-cols-2 py-2">
                              <dt className="text-sm font-medium">Daň z příjmu:</dt>
                              <dd className="text-sm text-right font-medium text-destructive">
                                -{optimizedResult.taxAmount.toFixed(2)} {displayCurrency}
                              </dd>
                            </div>
                            <div className="grid grid-cols-2 py-2">
                              <dt className="text-sm font-medium">Sociální pojištění:</dt>
                              <dd className="text-sm text-right font-medium text-destructive">
                                -{optimizedResult.socialSecurity.toFixed(2)} {displayCurrency}
                              </dd>
                            </div>
                            <div className="grid grid-cols-2 py-2">
                              <dt className="text-sm font-medium">Zdravotní pojištění:</dt>
                              <dd className="text-sm text-right font-medium text-destructive">
                                -{optimizedResult.healthInsurance.toFixed(2)} {displayCurrency}
                              </dd>
                            </div>
                            <div className="grid grid-cols-2 py-2">
                              <dt className="text-base font-semibold">Čistý příjem:</dt>
                              <dd className="text-base text-right font-bold text-green-600">
                                {optimizedResult.netIncome.toFixed(2)} {displayCurrency}
                              </dd>
                            </div>
                            <div className="pt-2">
                              <p className="text-xs text-muted-foreground text-center">
                                Efektivní daňová sazba: {(optimizedResult.effectiveTaxRate * 100).toFixed(2)}%
                              </p>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    ) : (
                      <Alert className="bg-muted/50">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Zadejte odpočitatelné položky</AlertTitle>
                        <AlertDescription>
                          Pro výpočet potenciální úspory doplňte údaje o odpočitatelných položkách jako
                          je dojíždění, náklady na bydlení nebo pracovní pomůcky.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  {/* Savings summary */}
                  {savings !== null && savings > 0 && (
                    <div className="bg-green-50 border border-green-200 p-6 rounded-lg mt-4">
                      <div className="text-center">
                        <h4 className="text-lg font-medium text-green-800 mb-2">
                          Potenciální úspora na dani
                        </h4>
                        <p className="text-3xl font-bold text-green-600">
                          {savings.toFixed(2)} {displayCurrency}
                        </p>
                        <p className="text-sm text-green-700 mt-2">
                          S odpočitatelnými položkami můžete ročně ušetřit až tuto částku na dani z příjmu.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tips">
              <div className="prose prose-sm sm:prose max-w-none">
                <h3>Jak optimalizovat vaše daně jako pendler</h3>
                
                <p>
                  Zde jsou nejdůležitější tipy, které vám mohou pomoci ušetřit na daních při práci v Německu:
                </p>
                
                <h4>1. Náklady na dojíždění (Entfernungspauschale)</h4>
                <p>
                  <strong>Jak to funguje:</strong> Můžete si odečíst 0,30 € za každý kilometr jednosměrné cesty do práce pro prvních 20 km 
                  a 0,38 € za každý další kilometr nad 20 km. Počítá se nejkratší možná trasa a uplatňuje se za každý odpracovaný den.
                </p>
                <p>
                  <strong>Příklad:</strong> Při dojíždění 50 km jedním směrem a 220 pracovních dnech v roce může odpočet činit až 3 828 €.
                </p>
                
                <h4>2. Druhé bydlení (Doppelte Haushaltsführung)</h4>
                <p>
                  Pokud máte hlavní bydliště v ČR, ale kvůli práci pronajímáte byt v Německu, můžete si odečíst:
                </p>
                <ul>
                  <li>Náklady na nájem (do 1 000 € měsíčně)</li>
                  <li>Náklady na vybavení bytu (do 5 000 € ročně)</li>
                  <li>Náklady na cesty domů (jednou týdně)</li>
                </ul>
                
                <h4>3. Pracovní pomůcky a vybavení (Arbeitsmittel)</h4>
                <p>
                  Můžete odečíst náklady na pracovní pomůcky a vybavení, které potřebujete ke své práci:
                </p>
                <ul>
                  <li>Pracovní oděvy a jejich čištění (ne běžné oblečení)</li>
                  <li>Nástroje a nářadí</li>
                  <li>Počítač a software pro pracovní účely</li>
                  <li>Odborná literatura a vzdělávací materiály</li>
                </ul>
                
                <h4>4. Další odpočitatelné položky</h4>
                <ul>
                  <li><strong>Náklady na daňové poradenství:</strong> Poplatky za vyplnění daňového přiznání</li>
                  <li><strong>Náklady na jazykové kurzy:</strong> Pokud jsou potřebné pro vaši práci</li>
                  <li><strong>Soukromé pojištění:</strong> Zdravotní, úrazové, životní pojištění</li>
                </ul>
                
                <div className="bg-blue-50 p-4 rounded-md my-4">
                  <h4 className="text-blue-800 mt-0">Důležitá poznámka</h4>
                  <p className="mb-0">
                    Daňová optimalizace vyžaduje pečlivou dokumentaci. Uchovávejte všechny účtenky, faktury a potvrzení
                    související s vašimi odpočitatelnými položkami po dobu nejméně 7 let pro případnou kontrolu finančního úřadu.
                  </p>
                </div>
                
                <h4>5. Výhody daňového přiznání pro pendlery</h4>
                <p>
                  Někteří pendleři získají při podání daňového přiznání vrácení daně ve výši několika tisíc eur ročně.
                  Tento nástroj vám může pomoci odhadnout, kolik byste mohli ušetřit díky správné optimalizaci.
                </p>
                
                <div className="flex justify-start mt-4">
                  <Button variant="outline" className="gap-2" asChild>
                    <a href="https://www.steuerklassen.com/en/" target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4" />
                      Oficiální informace o daňových třídách
                    </a>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxOptimizer;
