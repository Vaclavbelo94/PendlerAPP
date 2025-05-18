import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Calculator } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTaxCalculator } from "@/hooks/useTaxCalculator";
import { useMediaQuery } from "@/hooks/use-media-query";

const TaxCalculator = () => {
  const { toast } = useToast();
  const { calculateTax, result } = useTaxCalculator();
  const isMobile = useMediaQuery("xs");
  
  // Income Tax Calculator
  const [income, setIncome] = useState<string>("50000");
  const [country, setCountry] = useState<string>("de");
  const [taxClass, setTaxClass] = useState<string>("1");
  const [children, setChildren] = useState<string>("0");
  const [married, setMarried] = useState<boolean>(false);
  const [church, setChurch] = useState<boolean>(false);
  
  // VAT Calculator
  const [price, setPrice] = useState<string>("1000");
  const [vatRate, setVatRate] = useState<string>("21");
  const [includesVat, setIncludesVat] = useState<boolean>(true);
  const [vatAmount, setVatAmount] = useState<number | null>(null);
  const [priceWithoutVat, setPriceWithoutVat] = useState<number | null>(null);
  const [priceWithVat, setPriceWithVat] = useState<number | null>(null);
  
  const handleCalculateTax = () => {
    const result = calculateTax(income, {
      country,
      taxClass,
      children: parseInt(children),
      married,
      church
    });
    
    if (result) {
      toast({
        title: "Daňový výpočet dokončen",
        description: `Čistý příjem: ${result.netIncome.toFixed(2)} ${country === "de" ? "EUR" : "CZK"}`,
      });
    }
  };
  
  const handleCalculateVat = () => {
    try {
      const priceValue = parseFloat(price);
      const vatRateValue = parseFloat(vatRate) / 100;
      
      if (isNaN(priceValue) || isNaN(vatRateValue) || priceValue < 0 || vatRateValue < 0) {
        toast({
          title: "Neplatná hodnota",
          description: "Zadejte platné hodnoty",
          variant: "destructive"
        });
        return;
      }
      
      if (includesVat) {
        // Price already includes VAT
        const priceWithoutVatValue = priceValue / (1 + vatRateValue);
        const vatAmountValue = priceValue - priceWithoutVatValue;
        
        setPriceWithoutVat(priceWithoutVatValue);
        setPriceWithVat(priceValue);
        setVatAmount(vatAmountValue);
      } else {
        // Price doesn't include VAT
        const vatAmountValue = priceValue * vatRateValue;
        const priceWithVatValue = priceValue + vatAmountValue;
        
        setPriceWithoutVat(priceValue);
        setPriceWithVat(priceWithVatValue);
        setVatAmount(vatAmountValue);
      }
      
      toast({
        title: "Výpočet DPH dokončen",
        description: `Cena s DPH: ${priceWithVat?.toFixed(2)} Kč`,
      });
    } catch (error) {
      toast({
        title: "Chyba výpočtu",
        description: "Došlo k chybě při výpočtu DPH",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="h-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle>Daňová kalkulačka</CardTitle>
        </div>
        <CardDescription>
          Kalkulačka pro výpočet daní a DPH
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="income" className="space-y-4">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <TabsTrigger value="income" className={isMobile ? "mb-2" : ""}>
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span>Daň z příjmu</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="vat">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>DPH</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          {/* Income Tax Calculator */}
          <TabsContent value="income" className="space-y-4">
            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="income">Hrubý příjem</Label>
                <Input
                  id="income"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Země</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Vyberte zemi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="de">Německo</SelectItem>
                    <SelectItem value="cz">Česko</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">  
              {country === "de" && (
                <div className="space-y-2">
                  <Label htmlFor="taxClass">Daňová třída</Label>
                  <Select value={taxClass} onValueChange={setTaxClass}>
                    <SelectTrigger id="taxClass">
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
              )}
              
              <div className="space-y-2">
                <Label htmlFor="children">Počet dětí</Label>
                <Input
                  id="children"
                  type="number"
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                  min="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="married"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={married}
                  onChange={(e) => setMarried(e.target.checked)}
                />
                <Label htmlFor="married">Ženatý/Vdaná</Label>
              </div>
              
              {country === "de" && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="church"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={church}
                    onChange={(e) => setChurch(e.target.checked)}
                  />
                  <Label htmlFor="church">Církevní daň</Label>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleCalculateTax}
              className={`w-full mt-4 ${isMobile ? "py-6" : ""}`}
              size={isMobile ? "lg" : "default"}
            >
              <Calculator className="mr-2 h-4 w-4" />
              Vypočítat daň
            </Button>
            
            {result && (
              <div className="mt-4 bg-muted rounded-md p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm">Hrubý příjem:</div>
                  <div className="text-sm font-bold text-right">
                    {result.grossIncome.toFixed(2)} {country === "de" ? "EUR" : "CZK"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm">Daň z příjmu:</div>
                  <div className="text-sm font-bold text-right text-destructive">
                    -{result.taxAmount.toFixed(2)} {country === "de" ? "EUR" : "CZK"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm">Sociální pojištění:</div>
                  <div className="text-sm font-bold text-right text-destructive">
                    -{result.socialSecurity.toFixed(2)} {country === "de" ? "EUR" : "CZK"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm">Zdravotní pojištění:</div>
                  <div className="text-sm font-bold text-right text-destructive">
                    -{result.healthInsurance.toFixed(2)} {country === "de" ? "EUR" : "CZK"}
                  </div>
                </div>
                <div className="border-t pt-2 grid grid-cols-2 gap-2">
                  <div className="text-base font-medium">Čistý příjem:</div>
                  <div className="text-base font-bold text-right text-green-600">
                    {result.netIncome.toFixed(2)} {country === "de" ? "EUR" : "CZK"}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Efektivní daňová sazba: {(result.effectiveTaxRate * 100).toFixed(2)}%
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* VAT Calculator */}
          <TabsContent value="vat" className="space-y-4">
            {/* VAT calculator form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Cena</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vatRate">Sazba DPH (%)</Label>
                <Select value={vatRate} onValueChange={setVatRate}>
                  <SelectTrigger id="vatRate">
                    <SelectValue placeholder="Vyberte sazbu DPH" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="21">21% (Základní)</SelectItem>
                    <SelectItem value="15">15% (První snížená)</SelectItem>
                    <SelectItem value="10">10% (Druhá snížená)</SelectItem>
                    <SelectItem value="19">19% (Německo - základní)</SelectItem>
                    <SelectItem value="7">7% (Německo - snížená)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                id="includesVat"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={includesVat}
                onChange={(e) => setIncludesVat(e.target.checked)}
              />
              <Label htmlFor="includesVat">Cena včetně DPH</Label>
            </div>
            
            <Button 
              onClick={handleCalculateVat}
              className={`w-full mt-2 ${isMobile ? "py-6" : ""}`}
              size={isMobile ? "lg" : "default"}
            >
              <Calculator className="mr-2 h-4 w-4" />
              Vypočítat DPH
            </Button>
            
            {vatAmount !== null && (
              <div className="mt-4 bg-muted rounded-md p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm">Cena bez DPH:</div>
                  <div className="text-sm font-bold text-right">
                    {priceWithoutVat?.toFixed(2)} Kč
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm">DPH ({vatRate}%):</div>
                  <div className="text-sm font-bold text-right">
                    {vatAmount.toFixed(2)} Kč
                  </div>
                </div>
                <div className="border-t pt-2 grid grid-cols-2 gap-2">
                  <div className="text-base font-medium">Cena s DPH:</div>
                  <div className="text-base font-bold text-right">
                    {priceWithVat?.toFixed(2)} Kč
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;
