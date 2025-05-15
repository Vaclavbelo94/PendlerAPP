
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Globe, BadgeEuroIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type TaxScenario = {
  id: string;
  name: string;
  description: string;
  taxRateHome: number;
  taxRateWork: number;
  socialSecurityHome: number;
  socialSecurityWork: number;
  specialRules?: string;
};

const crossBorderScenarios: TaxScenario[] = [
  {
    id: "de-cz",
    name: "Německo - Česká republika",
    description: "Bydliště v ČR, práce v Německu",
    taxRateHome: 0.15, // 15% daň v ČR
    taxRateWork: 0.35, // Přibližná daň v Německu
    socialSecurityHome: 0,
    socialSecurityWork: 0.2, // 20% odvody v Německu
    specialRules: "183 dní: Pokud pracujete v Německu méně než 183 dní v roce, můžete danit příjem v ČR."
  },
  {
    id: "de-pl",
    name: "Německo - Polsko",
    description: "Bydliště v Polsku, práce v Německu",
    taxRateHome: 0.17, // 17% daň v Polsku
    taxRateWork: 0.35, // Přibližná daň v Německu
    socialSecurityHome: 0,
    socialSecurityWork: 0.2, // 20% odvody v Německu
    specialRules: "Směrnice 883/2004: Sociální pojištění se platí pouze v jedné zemi (obvykle v Německu)."
  },
  {
    id: "de-at",
    name: "Německo - Rakousko",
    description: "Bydliště v Rakousku, práce v Německu",
    taxRateHome: 0,
    taxRateWork: 0.35, // Přibližná daň v Německu
    socialSecurityHome: 0,
    socialSecurityWork: 0.2, // 20% odvody v Německu
    specialRules: "Příjmy jsou zdaněny v Německu, ale musíte je uvést v rakouském daňovém přiznání."
  },
  {
    id: "de-fr",
    name: "Německo - Francie",
    description: "Bydliště ve Francii, práce v Německu",
    taxRateHome: 0,
    taxRateWork: 0.35, // Přibližná daň v Německu
    socialSecurityHome: 0,
    socialSecurityWork: 0.2, // 20% odvody v Německu
    specialRules: "Speciální pravidla platí pro obyvatele pohraničních regionů (do 30 km od hranice)."
  }
];

type TaxationMethod = "work" | "residence" | "both";

const CrossBorderTaxCalculator = () => {
  const [scenario, setScenario] = useState<string>("de-cz");
  const [grossIncome, setGrossIncome] = useState<string>("3000");
  const [daysWorked, setDaysWorked] = useState<string>("220");
  const [daysInWorkCountry, setDaysInWorkCountry] = useState<string>("220");
  const [taxationMethod, setTaxationMethod] = useState<TaxationMethod>("work");
  const [result, setResult] = useState<any>(null);
  
  const { toast } = useToast();
  
  const validateInputs = () => {
    const income = parseFloat(grossIncome);
    const totalDays = parseInt(daysWorked);
    const workCountryDays = parseInt(daysInWorkCountry);
    
    if (isNaN(income) || income <= 0) {
      toast({
        title: "Neplatná hodnota",
        description: "Zadejte platnou hodnotu příjmu",
        variant: "destructive"
      });
      return false;
    }
    
    if (isNaN(totalDays) || totalDays <= 0 || totalDays > 365) {
      toast({
        title: "Neplatná hodnota",
        description: "Zadejte platný počet pracovních dnů (1-365)",
        variant: "destructive"
      });
      return false;
    }
    
    if (isNaN(workCountryDays) || workCountryDays < 0 || workCountryDays > totalDays) {
      toast({
        title: "Neplatná hodnota",
        description: "Počet dnů v zemi zaměstnání nemůže být vyšší než celkový počet pracovních dnů",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  const calculateTax = () => {
    if (!validateInputs()) return;
    
    const income = parseFloat(grossIncome);
    const totalDays = parseInt(daysWorked);
    const workCountryDays = parseInt(daysInWorkCountry);
    const homeCountryDays = totalDays - workCountryDays;
    
    const selectedScenario = crossBorderScenarios.find(s => s.id === scenario);
    if (!selectedScenario) return;
    
    // Poměr příjmu podle odpracovaných dnů
    const workCountryIncome = income * (workCountryDays / totalDays);
    const homeCountryIncome = income * (homeCountryDays / totalDays);
    
    let taxWorkCountry = 0;
    let taxHomeCountry = 0;
    let socialSecurityWorkCountry = 0;
    let socialSecurityHomeCountry = 0;
    
    // Výpočet podle zvoleného režimu zdanění
    if (taxationMethod === "work" || workCountryDays >= 183) {
      // Zdanění v zemi zaměstnání
      taxWorkCountry = workCountryIncome * selectedScenario.taxRateWork;
      socialSecurityWorkCountry = income * selectedScenario.socialSecurityWork; // Sociální pojištění se obvykle platí z celého příjmu
    } else if (taxationMethod === "residence") {
      // Zdanění v zemi bydliště
      taxHomeCountry = income * selectedScenario.taxRateHome;
      socialSecurityHomeCountry = income * selectedScenario.socialSecurityHome;
    } else if (taxationMethod === "both") {
      // Zdanění rozděleno podle odpracovaných dnů
      taxWorkCountry = workCountryIncome * selectedScenario.taxRateWork;
      taxHomeCountry = homeCountryIncome * selectedScenario.taxRateHome;
      socialSecurityWorkCountry = workCountryIncome * selectedScenario.socialSecurityWork;
      socialSecurityHomeCountry = homeCountryIncome * selectedScenario.socialSecurityHome;
    }
    
    const totalTax = taxWorkCountry + taxHomeCountry;
    const totalSocialSecurity = socialSecurityWorkCountry + socialSecurityHomeCountry;
    const netIncome = income - totalTax - totalSocialSecurity;
    
    setResult({
      grossIncome: income,
      workCountryDays,
      homeCountryDays,
      workCountryIncome,
      homeCountryIncome,
      taxWorkCountry,
      taxHomeCountry,
      totalTax,
      socialSecurityWorkCountry,
      socialSecurityHomeCountry,
      totalSocialSecurity,
      netIncome,
      taxationMethod,
      scenarioName: selectedScenario.name,
      specialRules: selectedScenario.specialRules
    });
    
    toast({
      title: "Výpočet dokončen",
      description: `Čistý příjem: ${netIncome.toFixed(2)} €`,
    });
  };
  
  const getScenarioRuleExplanation = () => {
    const selectedScenario = crossBorderScenarios.find(s => s.id === scenario);
    if (!selectedScenario) return null;
    
    const workCountryDays = parseInt(daysInWorkCountry);
    
    if (workCountryDays >= 183) {
      return (
        <div className="bg-blue-50 p-4 rounded-md mt-4">
          <p className="font-medium">Pravidlo 183 dnů:</p>
          <p>Pracujete v zemi zaměstnání 183 nebo více dní v roce, proto se vaše příjmy zdaňují primárně tam.</p>
        </div>
      );
    } else {
      return (
        <div className="bg-blue-50 p-4 rounded-md mt-4">
          <p className="font-medium">Pravidlo 183 dnů:</p>
          <p>Pracujete v zemi zaměstnání méně než 183 dní v roce, máte proto možnost zdanit příjmy v zemi bydliště (závisí na konkrétní smlouvě o zamezení dvojího zdanění).</p>
        </div>
      );
    }
  };
  
  return (
    <Card className="border-dhl-yellow">
      <CardHeader className="border-b border-dhl-yellow">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-dhl-red" />
          <CardTitle>Kalkulačka pro přeshraniční pracovníky</CardTitle>
        </div>
        <CardDescription>
          Výpočet daní a odvodů pro přeshraniční pracovníky (tzv. pendlery)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scenario">Přeshraniční scénář</Label>
            <Select value={scenario} onValueChange={setScenario}>
              <SelectTrigger id="scenario" className="border-dhl-black focus-visible:ring-dhl-yellow">
                <SelectValue placeholder="Vyberte přeshraniční scénář" />
              </SelectTrigger>
              <SelectContent>
                {crossBorderScenarios.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name} - {s.description}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {scenario && crossBorderScenarios.find(s => s.id === scenario)?.specialRules && (
              <div className="text-sm text-muted-foreground mt-1">
                <span className="font-medium">Poznámka:</span> {crossBorderScenarios.find(s => s.id === scenario)?.specialRules}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gross-income">Roční hrubý příjem (EUR)</Label>
              <Input
                id="gross-income"
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(e.target.value)}
                className="border-dhl-black focus-visible:ring-dhl-yellow"
                placeholder="Zadejte váš hrubý roční příjem"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxation-method">Režim zdanění</Label>
              <Select value={taxationMethod} onValueChange={(value: TaxationMethod) => setTaxationMethod(value)}>
                <SelectTrigger id="taxation-method" className="border-dhl-black focus-visible:ring-dhl-yellow">
                  <SelectValue placeholder="Vyberte režim zdanění" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Zdanění v zemi zaměstnání</SelectItem>
                  <SelectItem value="residence">Zdanění v zemi bydliště</SelectItem>
                  <SelectItem value="both">Rozdělené zdanění</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="days-worked">Celkový počet pracovních dnů v roce</Label>
              <Input
                id="days-worked"
                type="number"
                min="1"
                max="365"
                value={daysWorked}
                onChange={(e) => setDaysWorked(e.target.value)}
                className="border-dhl-black focus-visible:ring-dhl-yellow"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="days-work-country">Počet pracovních dnů v zemi zaměstnání</Label>
              <Input
                id="days-work-country"
                type="number"
                min="0"
                max={daysWorked}
                value={daysInWorkCountry}
                onChange={(e) => setDaysInWorkCountry(e.target.value)}
                className="border-dhl-black focus-visible:ring-dhl-yellow"
              />
            </div>
          </div>
          
          {getScenarioRuleExplanation()}
          
          <Button 
            onClick={calculateTax} 
            className="w-full bg-dhl-red hover:bg-dhl-red/90 text-white"
          >
            <Calculator className="mr-2 h-4 w-4" />
            Vypočítat přeshraniční daně a odvody
          </Button>
        </div>
        
        {result && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <h3 className="text-lg font-medium mb-4">Výsledek výpočtu - {result.scenarioName}</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Základní údaje:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Roční hrubý příjem:</div>
                  <div className="text-sm font-medium text-right">{result.grossIncome.toLocaleString()} €</div>
                  
                  <div className="text-sm text-muted-foreground">Pracovní dny v zemi zaměstnání:</div>
                  <div className="text-sm font-medium text-right">{result.workCountryDays} dnů</div>
                  
                  <div className="text-sm text-muted-foreground">Pracovní dny v zemi bydliště:</div>
                  <div className="text-sm font-medium text-right">{result.homeCountryDays} dnů</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Rozdělení příjmu:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Příjem v zemi zaměstnání:</div>
                  <div className="text-sm font-medium text-right">{result.workCountryIncome.toLocaleString()} €</div>
                  
                  <div className="text-sm text-muted-foreground">Příjem v zemi bydliště:</div>
                  <div className="text-sm font-medium text-right">{result.homeCountryIncome.toLocaleString()} €</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Daně a odvody:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Daň v zemi zaměstnání:</div>
                  <div className="text-sm font-medium text-right">{result.taxWorkCountry.toLocaleString()} €</div>
                  
                  <div className="text-sm text-muted-foreground">Daň v zemi bydliště:</div>
                  <div className="text-sm font-medium text-right">{result.taxHomeCountry.toLocaleString()} €</div>
                  
                  <div className="text-sm text-muted-foreground">Sociální odvody v zemi zaměstnání:</div>
                  <div className="text-sm font-medium text-right">{result.socialSecurityWorkCountry.toLocaleString()} €</div>
                  
                  <div className="text-sm text-muted-foreground">Sociální odvody v zemi bydliště:</div>
                  <div className="text-sm font-medium text-right">{result.socialSecurityHomeCountry.toLocaleString()} €</div>
                  
                  <div className="text-sm font-bold">Celkové odvody:</div>
                  <div className="text-sm font-bold text-right">{(result.totalTax + result.totalSocialSecurity).toLocaleString()} €</div>
                </div>
              </div>
              
              <div className="bg-dhl-yellow/10 p-3 rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-base font-bold">Čistý roční příjem:</div>
                  <div className="text-base font-bold text-right text-dhl-red">{result.netIncome.toLocaleString()} €</div>
                  
                  <div className="text-sm text-muted-foreground">Měsíční čistý příjem:</div>
                  <div className="text-sm font-medium text-right">{(result.netIncome / 12).toLocaleString()} €</div>
                </div>
              </div>
              
              {result.specialRules && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="font-medium">Důležité informace:</p>
                  <p className="text-sm">{result.specialRules}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CrossBorderTaxCalculator;
