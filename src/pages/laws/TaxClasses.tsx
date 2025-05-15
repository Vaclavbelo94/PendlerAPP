import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Calculator, BadgeEuroIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const TaxClasses = () => {
  const [income, setIncome] = useState<string>("0");
  const [taxClass, setTaxClass] = useState<string>("1");
  const [calculatedTax, setCalculatedTax] = useState<number | null>(null);
  const [netIncome, setNetIncome] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [taxDetails, setTaxDetails] = useState<any>(null);
  const { toast } = useToast();

  const calculateTax = () => {
    const incomeValue = parseFloat(income);
    
    if (isNaN(incomeValue) || incomeValue < 0) {
      toast({
        title: "Neplatná hodnota",
        description: "Zadejte platnou hodnotu příjmu",
        variant: "destructive"
      });
      return;
    }
    
    // Tax calculation with more details
    let taxRate: number;
    let solidaritySurcharge: number = 0;
    let churchTax: number = 0;
    let socialSecurityRate: number = 0.185; // 18.5% total social security
    
    // Base tax rate based on tax class
    switch (taxClass) {
      case "1":
        taxRate = 0.35; // Class I - approximately 35%
        break;
      case "2":
        taxRate = 0.32; // Class II - approximately 32%
        break;
      case "3":
        taxRate = 0.30; // Class III - approximately 30%
        break;
      case "4":
        taxRate = 0.35; // Class IV - approximately 35%
        break;
      case "5":
        taxRate = 0.42; // Class V - approximately 42%
        break;
      case "6":
        taxRate = 0.45; // Class VI - approximately 45%
        break;
      default:
        taxRate = 0.35;
    }
    
    // Apply solidarity surcharge for high incomes
    if (incomeValue > 62000) {
      solidaritySurcharge = 0.055; // 5.5% of income tax
    }
    
    // Calculate components
    const baseTaxAmount = incomeValue * taxRate;
    const solidarityAmount = baseTaxAmount * solidaritySurcharge;
    const churchTaxAmount = baseTaxAmount * churchTax;
    const socialSecurityAmount = incomeValue * socialSecurityRate;
    
    // Total deductions
    const totalTaxes = baseTaxAmount + solidarityAmount + churchTaxAmount;
    const totalDeductions = totalTaxes + socialSecurityAmount;
    const netIncomeAmount = incomeValue - totalDeductions;
    
    setCalculatedTax(totalTaxes);
    setNetIncome(netIncomeAmount);
    setTaxDetails({
      baseTax: baseTaxAmount,
      solidarity: solidarityAmount,
      church: churchTaxAmount,
      socialSecurity: socialSecurityAmount,
      healthInsurance: incomeValue * 0.075, // 7.5% of gross income
      pensionInsurance: incomeValue * 0.093, // 9.3% of gross income
      unemploymentInsurance: incomeValue * 0.012, // 1.2% of gross income
      nursingCareInsurance: incomeValue * 0.015, // 1.5% of gross income
    });
    
    toast({
      title: "Výpočet dokončen",
      description: `Odhadovaná daň pro daňovou třídu ${taxClass}: ${totalTaxes.toFixed(2)} €`,
    });
  };

  return (
    <div className="flex flex-col">
      {/* Header section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="container mx-auto px-4">
          <Link to="/laws" className="flex items-center mb-6 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Zpět na seznam zákonů
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Daňové třídy v Německu</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Přehled německých daňových tříd (Lohnsteuerklassen), jejich význam a vliv na zdanění příjmu.
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Přehled daňových tříd v Německu</CardTitle>
              <CardDescription>Systém daňových tříd a jejich základní charakteristika</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                V Německu existuje šest daňových tříd (Steuerklassen), které určují výši srážek daně z příjmu ze mzdy. Daňová třída se přiděluje na základě rodinného stavu, příjmu a dalších faktorů.
              </p>
              
              <div className="space-y-6">
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Daňová třída I</h3>
                  <p><strong>Pro koho:</strong> Svobodní, rozvedení, ovdovělí nebo v registrovaném partnerství, kteří nežijí s dítětem v jedné domácnosti.</p>
                  <p><strong>Charakteristika:</strong> Střední míra zdanění příjmu.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Daňová třída II</h3>
                  <p><strong>Pro koho:</strong> Svobodní, rozvedení nebo ovdovělí rodiče samoživitelé žijící s dítětem v jedné domácnosti.</p>
                  <p><strong>Charakteristika:</strong> Nižší míra zdanění než třída I, zahrnuje úlevu pro samoživitele.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Daňová třída III</h3>
                  <p><strong>Pro koho:</strong> Ženatí/vdané nebo registrovaní partneři, kde jeden z partnerů vydělává výrazně více (zatímco druhý má třídu V).</p>
                  <p><strong>Charakteristika:</strong> Nejnižší míra zdanění, vhodná pro hlavního živitele rodiny.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Daňová třída IV</h3>
                  <p><strong>Pro koho:</strong> Ženatí/vdané nebo registrovaní partneři s podobnou výší příjmu.</p>
                  <p><strong>Charakteristika:</strong> Střední míra zdanění, oba partneři jsou zdaněni stejně.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Daňová třída V</h3>
                  <p><strong>Pro koho:</strong> Ženatí/vdané nebo registrovaní partneři, kde jeden z partnerů vydělává výrazně méně (zatímco druhý má třídu III).</p>
                  <p><strong>Charakteristika:</strong> Nejvyšší míra zdanění, méně výhodná pro partnera s nižším příjmem.</p>
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Daňová třída VI</h3>
                  <p><strong>Pro koho:</strong> Pro osoby s více než jedním pracovním poměrem (pro druhé a další zaměstnání).</p>
                  <p><strong>Charakteristika:</strong> Nejvyšší míra zdanění, bez jakýchkoliv úlev a odpočtů.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Enhanced Tax Calculator Section */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <CardTitle>Daňová kalkulačka</CardTitle>
              </div>
              <CardDescription>Orientační výpočet daně podle daňové třídy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-md mb-4">
                  <p className="font-medium">Důležité upozornění:</p>
                  <p>Tato kalkulačka poskytuje pouze orientační výpočet daně. Přesná výše daně závisí na mnoha faktorech včetně odpočitatelných položek, příspěvků na sociální pojištění a dalších okolností.</p>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="income">Roční hrubý příjem (€)</Label>
                    <Input
                      id="income"
                      type="number"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Zadejte hrubý příjem"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxClass">Daňová třída</Label>
                    <select
                      id="taxClass"
                      value={taxClass}
                      onChange={(e) => setTaxClass(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="1">I - Svobodní/Rozvedení</option>
                      <option value="2">II - Samoživitelé</option>
                      <option value="3">III - Ženatí/Vdané (hlavní příjem)</option>
                      <option value="4">IV - Ženatí/Vdané (podobné příjmy)</option>
                      <option value="5">V - Ženatí/Vdané (vedlejší příjem)</option>
                      <option value="6">VI - Více zaměstnání</option>
                    </select>
                  </div>
                </div>
                
                <Button onClick={calculateTax} className="w-full">
                  <Calculator className="mr-2 h-4 w-4" />
                  Vypočítat daň
                </Button>
                
                {calculatedTax !== null && netIncome !== null && (
                  <div className="mt-4 p-4 bg-primary-50 rounded-md">
                    <p className="text-lg font-semibold">Výsledek výpočtu:</p>
                    <div className="flex justify-between items-center mt-2">
                      <span>Roční hrubý příjem:</span>
                      <span className="font-semibold">{parseInt(income).toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Odhadovaná daň z příjmu:</span>
                      <span className="font-semibold text-primary">{calculatedTax.toFixed(2).toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Čistý příjem po zdanění (přibližně):</span>
                      <span className="font-semibold">{netIncome.toFixed(2).toLocaleString()} €</span>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowDetails(!showDetails)}
                        className="w-full"
                      >
                        {showDetails ? "Skrýt detaily" : "Zobrazit detaily výpočtu"}
                      </Button>
                      
                      {showDetails && taxDetails && (
                        <div className="mt-4 space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Základní daň z příjmu:</span>
                            <span className="font-medium text-right">{taxDetails.baseTax.toFixed(2)} €</span>
                            
                            <span className="text-muted-foreground">Solidární příplatek:</span>
                            <span className="font-medium text-right">{taxDetails.solidarity.toFixed(2)} €</span>
                            
                            <span className="text-muted-foreground">Církevní daň:</span>
                            <span className="font-medium text-right">{taxDetails.church.toFixed(2)} €</span>
                            
                            <span className="text-muted-foreground">Zdravotní pojištění:</span>
                            <span className="font-medium text-right">{taxDetails.healthInsurance.toFixed(2)} €</span>
                            
                            <span className="text-muted-foreground">Důchodové pojištění:</span>
                            <span className="font-medium text-right">{taxDetails.pensionInsurance.toFixed(2)} €</span>
                            
                            <span className="text-muted-foreground">Pojištění pro případ nezaměstnanosti:</span>
                            <span className="font-medium text-right">{taxDetails.unemploymentInsurance.toFixed(2)} €</span>
                            
                            <span className="text-muted-foreground">Pojištění dlouhodobé péče:</span>
                            <span className="font-medium text-right">{taxDetails.nursingCareInsurance.toFixed(2)} €</span>
                          </div>
                          
                          <div className="pt-2 mt-2 border-t">
                            <div className="flex justify-between">
                              <span className="font-medium">Celkové daňové odvody:</span>
                              <span className="font-medium">{calculatedTax.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Celkové sociální odvody:</span>
                              <span className="font-medium">{taxDetails.socialSecurity.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between mt-2">
                              <span className="font-medium">Efektivní daňová sazba:</span>
                              <span className="font-medium">
                                {((calculatedTax + taxDetails.socialSecurity) / parseFloat(income) * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 p-2 rounded-md mt-4">
                            <p className="text-xs">
                              Tato kalkulačka poskytuje pouze zjednodušený odhad. Přesný výpočet daně závisí na mnoha dalších faktorech.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-4">
                      Tento výpočet je zjednodušený a nezahrnuje všechny faktory ovlivňující výši daně, jako jsou odpočitatelné položky, příspěvky na sociální a zdravotní pojištění atd.
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-border">
                      <Link to="/calculator" className="flex items-center text-primary hover:underline">
                        <BadgeEuroIcon className="mr-2 h-4 w-4" />
                        Použít pokročilou kalkulačku daně
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Volba daňových tříd u manželů/registrovaných partnerů</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Manželé a registrovaní partneři mají na výběr z těchto kombinací daňových tříd:
              </p>
              
              <ul className="list-disc pl-5 space-y-3 mb-6">
                <li>
                  <strong>Kombinace III/V</strong> - výhodná, pokud jeden z partnerů vydělává výrazně více než druhý. Partner s vyšším příjmem si zvolí třídu III, partner s nižším příjmem třídu V.
                </li>
                <li>
                  <strong>Kombinace IV/IV</strong> - vhodná, pokud oba partneři vydělávají podobně. Oba si zvolí třídu IV.
                </li>
                <li>
                  <strong>Kombinace IV/IV s faktorem</strong> - umožňuje spravedlivější rozdělení daňové zátěže mezi partnery s různými příjmy.
                </li>
              </ul>
              
              <div className="bg-yellow-50 p-4 rounded-md mb-6">
                <p className="font-medium">Důležité:</p>
                <p className="mb-2">Volba daňové třídy ovlivňuje pouze výši měsíčních srážek daně z příjmu, nikoliv celkovou roční daňovou povinnost.</p>
                <p>Při ročním zúčtování daně (Steuererklärung) dochází k přesnému výpočtu daňové povinnosti bez ohledu na zvolenou daňovou třídu.</p>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Kdy se vyplatí kombinace III/V?</h3>
              <p className="mb-4">
                Tato kombinace se vyplatí, když jeden z partnerů vydělává výrazně více než druhý. Může však vést k vysokému nedoplatku při ročním zúčtování, pokud oba partneři vydělávají podobně, ale zvolí si tuto kombinaci.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Kdy se vyplatí kombinace IV/IV?</h3>
              <p className="mb-4">
                Tato kombinace je vhodnější, když oba partneři vydělávají podobně. Vede k vyrovnanějšímu rozdělení daňové zátěže během roku a minimalizuje riziko nedoplatku při ročním zúčtování.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Změna daňové třídy a její dopady</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Změnu daňové třídy lze provést u místního finančního úřadu (Finanzamt) nebo online prostřednictvím portálu ELSTER. Změna je možná jednou za kalendářní rok.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Dopady změny daňové třídy</h3>
              <p className="mb-2">Změna daňové třídy může ovlivnit:</p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Výši měsíčního čistého příjmu</li>
                <li>Výši některých sociálních dávek (rodičovský příspěvek, podpora v nezaměstnanosti, nemocenská)</li>
                <li>Výši příspěvků na zdravotní pojištění a sociální zabezpečení</li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="font-medium">Pozor:</p>
                <p className="mb-2">Změna daňové třídy má vliv i na výpočet některých dávek, jako je rodičovský příspěvek (Elterngeld) nebo nemocenská (Krankengeld).</p>
                <p>Pokud plánujete čerpání těchto dávek, je vhodné změnit daňovou třídu alespoň 7 měsíců před jejich nárokováním.</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center mt-8">
            <Link to="/laws">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Zpět na seznam zákonů
              </Button>
            </Link>
            <a href="https://www.bundesfinanzministerium.de/Web/DE/Themen/Steuern/Steuerarten/Lohnsteuer/lohnsteuer.html" target="_blank" rel="noopener noreferrer">
              <Button>
                Oficiální zdroj informací
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaxClasses;
