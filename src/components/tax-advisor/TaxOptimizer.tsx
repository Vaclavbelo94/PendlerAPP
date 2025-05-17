
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Euro, Calculator, Info } from "lucide-react";
import { useTaxCalculator } from "@/hooks/useTaxCalculator";
import { useToast } from "@/components/ui/use-toast";

interface OptimizationResult {
  grossIncomeDE: number;
  taxAmountDE: number;
  netIncomeDE: number;
  grossIncomeCZ: number;
  taxAmountCZ: number;
  netIncomeCZ: number;
  totalNetIncome: number;
  savings: number;
  optimalRatio: string;
}

const TaxOptimizer = () => {
  const { calculateTax } = useTaxCalculator();
  const { toast } = useToast();
  
  const [grossIncome, setGrossIncome] = useState<string>("60000");
  const [taxClass, setTaxClass] = useState<string>("1");
  const [children, setChildren] = useState<string>("0");
  const [married, setMarried] = useState<boolean>(false);
  const [church, setChurch] = useState<boolean>(false);
  const [germanRatio, setGermanRatio] = useState<number>(80);
  
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  
  const handleOptimize = () => {
    try {
      // Parse inputs
      const totalIncome = parseFloat(grossIncome);
      const childrenCount = parseInt(children);
      
      if (isNaN(totalIncome) || totalIncome <= 0) {
        toast({
          title: "Neplatný příjem",
          description: "Zadejte platnou hodnotu příjmu",
          variant: "destructive"
        });
        return;
      }
      
      // Calculate German income based on ratio
      const germanIncome = totalIncome * (germanRatio / 100);
      const czechIncome = totalIncome - germanIncome;
      
      // Calculate taxes for each country
      const germanResult = calculateTax(germanIncome, {
        country: "de",
        taxClass,
        children: childrenCount,
        married,
        church
      });
      
      const czechResult = calculateTax(czechIncome, {
        country: "cz",
        children: childrenCount,
        married
      });
      
      if (!germanResult || !czechResult) {
        toast({
          title: "Chyba výpočtu",
          description: "Nepodařilo se provést výpočet",
          variant: "destructive"
        });
        return;
      }
      
      // Find optimal allocation (simple approximation)
      const currentNetTotal = germanResult.netIncome + czechResult.netIncome;
      
      // Try different allocations to find optimal
      let bestRatio = germanRatio;
      let bestNetIncome = currentNetTotal;
      let bestGermanResult = germanResult;
      let bestCzechResult = czechResult;
      
      for (let ratio = 60; ratio <= 100; ratio += 5) {
        const testGermanIncome = totalIncome * (ratio / 100);
        const testCzechIncome = totalIncome - testGermanIncome;
        
        const testGermanResult = calculateTax(testGermanIncome, {
          country: "de",
          taxClass,
          children: childrenCount,
          married,
          church
        });
        
        const testCzechResult = calculateTax(testCzechIncome, {
          country: "cz",
          children: childrenCount,
          married
        });
        
        if (testGermanResult && testCzechResult) {
          const testTotal = testGermanResult.netIncome + testCzechResult.netIncome;
          
          if (testTotal > bestNetIncome) {
            bestNetIncome = testTotal;
            bestRatio = ratio;
            bestGermanResult = testGermanResult;
            bestCzechResult = testCzechResult;
          }
        }
      }
      
      // Set optimization result
      setResult({
        grossIncomeDE: bestGermanResult.grossIncome,
        taxAmountDE: bestGermanResult.taxAmount,
        netIncomeDE: bestGermanResult.netIncome,
        grossIncomeCZ: bestCzechResult.grossIncome,
        taxAmountCZ: bestCzechResult.taxAmount,
        netIncomeCZ: bestCzechResult.netIncome,
        totalNetIncome: bestGermanResult.netIncome + bestCzechResult.netIncome,
        savings: bestNetIncome - currentNetTotal,
        optimalRatio: `${bestRatio}% DE / ${100 - bestRatio}% CZ`
      });
      
      // If optimal ratio is different, recommend it
      if (bestRatio !== germanRatio) {
        toast({
          title: "Nalezeno optimální rozdělení příjmů",
          description: `Optimální rozdělení je ${bestRatio}% v Německu a ${100-bestRatio}% v ČR, což přinese úsporu přibližně ${Math.round(bestNetIncome - currentNetTotal)} €.`,
        });
      }
    } catch (error) {
      console.error("Optimization error:", error);
      toast({
        title: "Chyba optimalizace",
        description: "Při výpočtu optimalizace došlo k chybě",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="optimize" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="optimize">Optimalizace daní</TabsTrigger>
          <TabsTrigger value="calculator">Daňová kalkulačka</TabsTrigger>
        </TabsList>
        
        <TabsContent value="optimize">
          <Card>
            <CardHeader>
              <CardTitle>Kalkulačka optimalizace daní pro přeshraniční pracovníky</CardTitle>
              <CardDescription>
                Vypočtěte optimální rozdělení příjmů mezi Českou republiku a Německo pro minimalizaci daňové zátěže
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="income">Celkový roční příjem (€)</Label>
                      <div className="relative">
                        <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="income"
                          type="number"
                          placeholder="60000"
                          className="pl-10"
                          value={grossIncome}
                          onChange={(e) => setGrossIncome(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="german-ratio">Rozdělení příjmů</Label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Česká republika</span>
                        <span className="text-sm">Německo</span>
                      </div>
                      <Slider
                        defaultValue={[80]}
                        max={100}
                        step={1}
                        value={[germanRatio]}
                        onValueChange={(value) => setGermanRatio(value[0])}
                      />
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">{100 - germanRatio}%</span>
                        <span className="text-xs font-medium">{germanRatio}%</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-6" onClick={handleOptimize}>
                      <Calculator className="mr-2 h-4 w-4" />
                      Optimalizovat daňovou zátěž
                    </Button>
                    
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                      >
                        {showAdvanced ? 'Skrýt rozšířené nastavení' : 'Zobrazit rozšířené nastavení'}
                      </Button>
                    </div>
                  </div>
                  
                  {result && (
                    <Card className="bg-primary/5 border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Výsledek optimalizace</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Optimální rozdělení</p>
                            <p className="text-2xl font-bold">{result.optimalRatio}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Daňová úspora</p>
                            <p className="text-2xl font-bold text-emerald-600">
                              {formatCurrency(result.savings)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="border-t pt-2">
                          <p className="font-medium mb-2">Podrobný rozpis</p>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Hrubý příjem DE:</span>
                              <span className="font-medium">{formatCurrency(result.grossIncomeDE)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Daň DE:</span>
                              <span className="font-medium">{formatCurrency(result.taxAmountDE)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Čistý příjem DE:</span>
                              <span className="font-medium">{formatCurrency(result.netIncomeDE)}</span>
                            </div>
                            <div className="border-t border-border/50 my-1"></div>
                            <div className="flex justify-between">
                              <span>Hrubý příjem CZ:</span>
                              <span className="font-medium">{formatCurrency(result.grossIncomeCZ)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Daň CZ:</span>
                              <span className="font-medium">{formatCurrency(result.taxAmountCZ)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Čistý příjem CZ:</span>
                              <span className="font-medium">{formatCurrency(result.netIncomeCZ)}</span>
                            </div>
                            <div className="border-t border-border mt-1 pt-1">
                              <div className="flex justify-between">
                                <span className="font-bold">Celkový čistý příjem:</span>
                                <span className="font-bold">{formatCurrency(result.totalNetIncome)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {showAdvanced && (
                  <div className="pt-2 border-t">
                    <h3 className="font-medium mb-4">Rozšířené nastavení</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="tax-class">Daňová třída</Label>
                        <Select value={taxClass} onValueChange={setTaxClass}>
                          <SelectTrigger>
                            <SelectValue placeholder="Vyberte daňovou třídu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Třída I</SelectItem>
                            <SelectItem value="2">Třída II</SelectItem>
                            <SelectItem value="3">Třída III</SelectItem>
                            <SelectItem value="4">Třída IV</SelectItem>
                            <SelectItem value="5">Třída V</SelectItem>
                            <SelectItem value="6">Třída VI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="children">Počet dětí</Label>
                        <Input
                          id="children"
                          type="number"
                          min="0"
                          max="10"
                          value={children}
                          onChange={(e) => setChildren(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="married" 
                            checked={married} 
                            onCheckedChange={setMarried} 
                          />
                          <Label htmlFor="married">Ženatý/vdaná</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="church" 
                            checked={church} 
                            onCheckedChange={setChurch} 
                          />
                          <Label htmlFor="church">Církevní daň</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 border-t">
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  Kalkulačka nabízí orientační výsledky. Pro přesné daňové plánování doporučujeme konzultaci 
                  s daňovým poradcem, který zná vaši specifickou situaci a aktuální daňové zákony.
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle>Daňová kalkulačka</CardTitle>
              <CardDescription>
                Výpočet čistého příjmu v Německu a České republice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground mb-8">
                Pro výpočet daní přepněte na záložku "Optimalizace daní"
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxOptimizer;
